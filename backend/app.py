from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import os

app = Flask(__name__)
CORS(app) # Allow Next.js communication

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def generate_sha256(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

@app.route('/analyze_bond', methods=['POST'])
def analyze_bond():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # 1. Generate Trust Hash
    doc_hash = generate_sha256(file_path)

    # 2. Mock AI Analysis (Reliable for Demo)
    ai_response = {
        "bond_name": "Government of India 7.26% GS 2033",
        "isin": "IN0020230085",
        "risk_rating": "AAA (Sovereign)",
        "detected_yield": 726, 
        "ai_confidence": "99.8%"
    }

    return jsonify({
        "success": True,
        "hash": doc_hash,
        "ai_data": ai_response,
        "ipfs_cid": "QmXaKwMockHashForHackathon" 
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)