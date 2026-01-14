import os
import hashlib
import json
import time
import requests
import yfinance as yf 
from web3 import Web3 
from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Celo Configuration
CELO_RPC = "https://forno.celo-sepolia.celo-testnet.org" 
CONTRACT_ADDRESS = "0xE715acd4c54F030d021b7147c20786623fFf482a"
PRIVATE_KEY = os.getenv("PRIVATE_KEY") 

CONTRACT_ABI_JSON = """
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_isin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_faceValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_initialYield",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "createAsset",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_bondId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "mintFractionalShares",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextBondId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bonds",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "isin",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "faceValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentYield",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastUpdate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
"""
CONTRACT_ABI = json.loads(CONTRACT_ABI_JSON)

# Initialize Web3 if private key is available
w3 = None
account = None
if PRIVATE_KEY:
    w3 = Web3(Web3.HTTPProvider(CELO_RPC))
    account = w3.eth.account.from_key(PRIVATE_KEY)

# IPFS Upload Function
def upload_to_ipfs(file_path):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "pinata_api_key": os.getenv("PINATA_API_KEY"),
        "pinata_secret_api_key": os.getenv("PINATA_SECRET_API_KEY")
    }
    if not headers["pinata_api_key"]:
        return None
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, files=files, headers=headers)
        if response.status_code == 200:
            return response.json()['IpfsHash']
        return None

def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text[:6000] 

def analyze_with_groq(text):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    prompt = f"""
    Extract the following details from this bond document in strict JSON format:
    - bond_name (string)
    - isin (string)
    - yield_rate (number, e.g., 7.2)
    - risk_rating (string)
    - face_value_amount (number only)
    
    Document Text:
    {text}
    
    Return ONLY JSON. No markdown.
    """
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    
    try:
        content = completion.choices[0].message.content
        start = content.find('{')
        end = content.rfind('}') + 1
        if start != -1 and end != -1:
            json_str = content[start:end]
            return json.loads(json_str)
        return json.loads(content)
    except:
        return {"bond_name": "Unknown", "isin": "Unknown", "yield_rate": 0, "risk_rating": "Unknown", "face_value_amount": 0}

def generate_sha256(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def get_real_bond_yield():
    try:
        ticker = yf.Ticker("^TNX") 
        data = ticker.history(period="1d")
        if data.empty:
            return 7.20
        latest_yield = data['Close'].iloc[-1]
        return float(latest_yield)
    except Exception as e:
        print(f"Error fetching yield: {e}")
        return 7.20 

def send_transaction(function_call):
    if not w3 or not account:
        return None
    nonce = w3.eth.get_transaction_count(account.address)
    tx = function_call.build_transaction({
        'chainId': 11142220, 
        'gas': 2000000,
        'gasPrice': w3.eth.gas_price,
        'nonce': nonce,
    })
    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return w3.to_hex(tx_hash)

# Endpoint 1: Analyze Bond with IPFS (Original)
@app.route('/analyze_bond', methods=['POST'])
def analyze_bond():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    doc_hash = generate_sha256(file_path)

    print("Uploading to IPFS...")
    ipfs_cid = upload_to_ipfs(file_path)

    print("Analyzing with Llama 3...")
    pdf_text = extract_text_from_pdf(file_path)
    ai_data = analyze_with_groq(pdf_text)

    blockchain_yield = int(float(ai_data.get('yield_rate', 0)) * 100)

    return jsonify({
        "success": True,
        "hash": doc_hash,
        "ipfs_cid": ipfs_cid,
        "ai_data": {
            "bond_name": ai_data.get('bond_name'),
            "isin": ai_data.get('isin'),
            "risk_rating": ai_data.get('risk_rating'),
            "detected_yield": blockchain_yield,
            "raw_yield": ai_data.get('yield_rate'),
            "face_value_amount": ai_data.get('face_value_amount', 0)
        }
    })

# Endpoint 2: Analyze with Oracle Data (Oracle version)
@app.route('/analyze_and_oracle', methods=['POST'])
def analyze_and_oracle():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
   
    pdf_text = extract_text_from_pdf(file_path)
    ai_data = analyze_with_groq(pdf_text)
    
    real_yield = get_real_bond_yield()

    return jsonify({
        "ai_analysis": {
            "bond_name": ai_data.get('bond_name'),
            "isin": ai_data.get('isin'),
            "face_value_amount": ai_data.get('face_value_amount', 0)
        },
        "oracle_data": {
            "source": "Yahoo Finance API",
            "ticker": "^TNX (10Y Yield)",
            "live_yield": real_yield,
            "timestamp": time.time()
        }
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
