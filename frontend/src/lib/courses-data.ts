export interface Lesson {
  id: string;
  title: string;
  description: string;
  aura: number;
  content: string; // HTML or Markdown content
  duration: number; // in minutes
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string; // Placeholder or path
  modules: Module[];
}

export const courses: Course[] = [
  {
    id: "blockchain-weilliptic-fundamentals",
    title: "Blockchain & Weilliptic Fundamentals",
    description: "Master the basics of distributed ledger technology and discover why Weilliptic's next-generation blockchain is the perfect home for Real World Assets.",
    image: "/weilliptic-fundamentals.png",
    modules: [
      {
        id: "module-1",
        title: "Module 1: Blockchain Basics (Beginner)",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Distributed Ledgers & Consensus",
            description: "Understand how blockchains maintain trust without intermediaries through distributed ledgers and consensus mechanisms.",
            aura: 50,
            duration: 10,
            content: `
              <h2>The Foundation of Trust</h2>
              <p>At its core, a <strong>blockchain</strong> is a distributed database that is shared among the nodes of a computer network. As a database, a blockchain stores information electronically in digital format.</p>
              
              <h3>1. Distributed Ledger Technology (DLT)</h3>
              <p>Imagine a Google Sheet that is shared with thousands of people. Everyone has a copy, and every time someone makes a change, everyone else's sheet updates instantly. However, unlike Google Sheets:</p>
              <ul>
                <li>No single person serves as the administrator.</li>
                <li>Once a row is filled (a "block"), it is locked and can never be erased ("immutable").</li>
              </ul>

              <h3>2. Key Concepts</h3>
              <ul>
                <li><strong>Decentralization:</strong> No single entity (like a bank or government) controls the network. This prevents censorship and single points of failure.</li>
                <li><strong>Immutability:</strong> Once data is written, it cannot be changed. This creates a permanent audit trail.</li>
                <li><strong>Transparency:</strong> All transactions are visible to anyone on the network (though identities may be pseudonymous).</li>
              </ul>

              <h3>3. Consensus Mechanisms</h3>
              <p>How do we agree on the truth without a central authority? We use a <em>consensus mechanism</em>.</p>
              <p><strong>Proof of Work (PoW):</strong> Used by Bitcoin. Miners solve complex math puzzles to secure the network. It requires significant energy.</p>
              <p><strong>Proof of Stake (PoS):</strong> Used by modern chains like Weilliptic and Ethereum 2.0. Validators "stake" (lock up) tokens to secure the network. This is over 99% more energy-efficient and faster.</p>
            `
          },
          {
            id: "lesson-1-2",
            title: "Smart Contracts 101",
            description: "Learn about self-executing contracts with the terms of the agreement between buyer and seller being directly written into lines of code.",
            aura: 75,
            duration: 15,
            content: `
              <h2>Code is Law</h2>
              <p><strong>Smart contracts</strong> are simply programs stored on a blockchain that run when predetermined conditions are met. They typically are used to automate the execution of an agreement so that all participants can be immediately certain of the outcome, without any intermediary's involvement or time loss.</p>
              
              <h3>How They Work</h3>
              <p>Think of a Vending Machine. You don't need a cashier to trust that if you put in $2 and press "C4", you will get a Snickers bar. The logic is hardcoded into the machine.</p>

              <div class="bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm border-l-4 border-green-400">
                <span class="text-gray-500">// Simple Smart Contract Concept (Solidity-like)</span><br><br>
                <span class="text-purple-400">contract</span> <span class="text-yellow-300">BondPayment</span> {<br>
                &nbsp;&nbsp;<span class="text-purple-400">function</span> <span class="text-blue-400">payout</span>() <span class="text-purple-400">public</span> {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-purple-400">if</span> (now >= maturityDate) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gray-400">// Automatically transfer funds</span><br>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;investor.transfer(principal + interest);<br>
                &nbsp;&nbsp;&nbsp;&nbsp;}<br>
                &nbsp;&nbsp;}<br>
                }
              </div>

              <h3>Benefits for Finance</h3>
              <ul>
                <li><strong>Speed:</strong> Settlement is instant (T+0), compared to T+2 or T+3 in traditional finance.</li>
                <li><strong>Cost:</strong> Removes the middleman fees (brokers, clearinghouses).</li>
                <li><strong>Trust:</strong> The logic is verifiable and open-source.</li>
              </ul>
            `
          }
        ]
      },
      {
        id: "module-2",
        title: "Module 2: The Weilliptic Advantage (Intermediate)",
        lessons: [
          {
            id: "lesson-2-1",
            title: "Next-Gen DeFi & Secure Architecture",
            description: "Exploring Weilliptic's mission to make financial tools accessible specifically for Real World Assets with advanced cryptographic security.",
            aura: 100,
            duration: 12,
            content: `
              <h2>DeFi for Everyone (Next-Gen Blockchain)</h2>
              <p>Weilliptic is different. While most blockchains are built for traditional desktop workflows, Weilliptic was built with advanced elliptic curve cryptography for maximum security and efficiency.</p>
              
              <h3>Weil SDK</h3>
              <p>One of Weilliptic's superpowers is its powerful SDK that enables seamless wallet integration and smart contract interaction. This allows developers to build secure dApps with ease.</p>

              <h2>Secure & Efficient Blockchain</h2>
              <p>Weilliptic uses cutting-edge cryptographic techniques to ensure both security and performance.</p>
              <p>For <strong>Real World Assets (RWAs)</strong> and institutional investing, this is crucial. Organizations can tokenize assets on Weilliptic with the confidence that the underlying infrastructure provides enterprise-grade security.</p>
            `
          }
        ]
      }
    ]
  },
  {
    id: "rwa-tokenization-mastery",
    title: "RWA Tokenization Mastery",
    description: "Deep dive into the trillion-dollar opportunity of bringing Real World Assets like government bonds and real estate onto the blockchain.",
    image: "/rwa-tokenization.png",
    modules: [
      {
        id: "rwa-mod-1",
        title: "Module 1: The RWA Revolution (Beginner)",
        lessons: [
            {
            id: "lesson-rwa-1",
            title: "What are RWAs?",
            description: "From T-Bills to Real Estate: Understanding the asset classes being migrated on-chain.",
            aura: 100,
            duration: 15,
            content: `
              <h2>Real World Assets (RWAs)</h2>
              <p><strong>Real World Assets (RWAs)</strong> are tangible and intangible assets from the physical world that are tokenized to exist on the blockchain.</p>
              <p>This is considered the "Endgame" for crypto, bridging the gap between the $2 Trillion crypto market and the $800+ Trillion traditional finance market.</p>

              <h3>Asset Classes Moving On-Chain</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="text-cyan-400 font-bold">Government Bonds</h4>
                    <p class="text-sm">US Treasury Bills (T-Bills) are the most popular RWA today, offering risk-free yield on-chain.</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="text-cyan-400 font-bold">Real Estate</h4>
                    <p class="text-sm">Fractional ownership of residential or commercial properties, allowing you to invest with as little as $50.</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="text-cyan-400 font-bold">Private Credit</h4>
                    <p class="text-sm">Loans to businesses in emerging markets, offering higher yields than DeFi lending protocols.</p>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg">
                    <h4 class="text-cyan-400 font-bold">Commodities</h4>
                    <p class="text-sm">Gold, Silver, and even Oil tokenized to allow 24/7 trading.</p>
                </div>
              </div>
            `
          },
          {
            id: "lesson-rwa-2",
            title: "The Tokenization Lifecycle",
            description: "The technical and legal lifecycle of creating a digital twin for a physical asset.",
            aura: 150,
            duration: 20,
            content: `
              <h2>How verifyChain Tokenizes Assets</h2>
              <p>Tokenization isn't just "uploading" a house to the internet. It requires a rigorous legal and technical process.</p>
              
              <ol class="list-decimal pl-5 space-y-4 my-6">
                <li>
                    <strong>Off-Chain Acquisition (SPV):</strong>
                    <p>A Special Purpose Vehicle (SPV) — a legal entity — is set up to purchase and hold the physical asset (e.g., the US Treasury Bond). This ensures the asset is legally ring-fenced.</p>
                </li>
                <li>
                    <strong>Information Bridge (Oracles):</strong>
                    <p>We cannot just trust the issuer. We use <strong>Chainlink</strong> or custom API adapters to verify the existence and value of the asset in the real world.</p>
                </li>
                <li>
                    <strong>Minting (Smart Contract):</strong>
                    <p>Once verified, the Smart Contract mints an equivalent amount of tokens. <code>1 Token = $1 share of the Asset</code>.</p>
                </li>
                <li>
                    <strong>Distribution (KYC/AML):</strong>
                    <p>Investors must often pass KYC (Know Your Customer) checks before they can hold these security tokens, complying with regulations.</p>
                </li>
              </ol>

              <div class="bg-blue-900/30 p-4 border border-blue-500/30 rounded-lg">
                <strong>Why this matters:</strong> This process turns an illiquid asset (like a building) into a liquid one (tokens) that can be used as collateral in DeFi protocols like Aave or Uniswap.
              </div>
            `
          }
        ]
      }
    ]
  },
  {
    id: "verifychain-protocol",
    title: "VerifyChain Protocol Deep Dive",
    description: "Learn how VerifyChain uses AI and Oracles to provide mathematically verified proof-of-reserve for tokenized government bonds.",
    image: "/verify-chain.png",
    modules: [
         {
        id: "vc-mod-1",
        title: "Module 1: Architecture (Advanced)",
        lessons: [
            {
            id: "lesson-vc-1",
            title: "Oracle Integration & Verification",
            description: "How we use Yahoo Finance and Chainlink to ensure real-time data accuracy.",
            aura: 200,
            duration: 15,
            content: `
              <h2>Trust but Verify</h2>
              <p>The biggest problem in RWAs is the "Oracle Problem": How does the blockchain know the asset actually exists in the bank vault?</p>
              <p>VerifyChain solves this with a multi-layered verification approach.</p>

              <h3>1. Real-Time Data Feeds</h3>
              <p>Our system integrates with trusted data sources like <strong>Yahoo Finance API</strong> to fetch real-time market data for bond yields (e.g., US10Y) and prices. This ensures that the on-chain representation matches the real-world value at all times.</p>

              <h3>2. Proof of Reserve (PoR)</h3>
              <p>We implement a cryptographic Proof of Reserve mechanism. This allows anyone to verify that:</p>
              <p class="text-center font-mono bg-black p-2 rounded text-green-400">Total Tokens Minted <= Total Assets Held in Custody</p>
              
              <p>If this equation ever breaks, the smart contract automatically pauses minting to protect investors.</p>
            `
          },
          {
            id: "lesson-vc-2",
            title: "Interacting with the Verified Bonds",
            description: "A technical guide to the CreateAsset and Bond Verification functions.",
            aura: 300,
            duration: 25,
            content: `
              <h2>The Core Contract: VerifyChainRWA.sol</h2>
              <p>The <code>VerifyChainRWA.sol</code> contract is the heart of our platform. It manages the lifecycle of the digital bond.</p>
              
              <h3>Key Functions</h3>
              
              <div class="space-y-4">
                  <div class="border border-gray-700 p-4 rounded-lg">
                      <h4 class="font-mono text-cyan-400">createAsset(string _isin, uint256 _faceValue)</h4>
                      <p class="text-sm mt-2">Mints a new RWA token. It requires the ISIN (International Securities Identification Number) and the Face Value of the bond.</p>
                  </div>

                  <div class="border border-gray-700 p-4 rounded-lg">
                      <h4 class="font-mono text-cyan-400">verifyAsset(uint256 _bondId)</h4>
                      <p class="text-sm mt-2">This function triggers the Oracle call. It checks the off-chain data source and updates the <code>lastUpdate</code> timestamp and <code>currentYield</code> on-chain.</p>
                  </div>
              </div>

              <h3>Investment Flow</h3>
              <ol>
                  <li>User connects Weilliptic Wallet.</li>
                  <li>User approves tokens to the contract.</li>
                  <li>User calls <code>invest()</code>.</li>
                  <li>Contract issues <strong>vBOND</strong> tokens to the user.</li>
                  <li>User earns yield automatically as the asset value rebases.</li>
              </ol>
            `
          }
        ]
      }
    ]
  }
];
