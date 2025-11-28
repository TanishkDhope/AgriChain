# AgriChain

AgriChain is an end-to-end system for tracking agricultural produce using blockchain (ERC-1155 tokens) and QR codes so that farmers receive fair prices and consumers receive verified produce. Each physical batch is represented by ERC-1155 tokens; when a batch is split the tokens are split, allowing each resulting batch to be tracked individually. The project also includes a personalized agentic bot that helps farmers get fair price information and local market insights.

**Key Goals**

- **Prevent exploitation:** Ensure transparent pricing and provenance so farmers are paid fairly.
- **Verify produce:** Consumers can scan QR codes to verify the origin and history of produce.
- **Fine-grained tracking:** Use ERC-1155 tokens to represent batches and split/trade history.
- **Farmer assistant:** Provide a chatbot/agent that advises about fair prices and nearby markets.

**Repository layout**

- `client/`: Frontend app (React + Vite). UI, QR code integration, farmer/consumer dashboards.
  - `src/blockchain/`: DApp helpers and product registry client code (`product_registry.js`, `Tokens.jsx`, `FileUpload.jsx`).
  - `src/consumer/`, `src/farmer/`, `src/product/`: role-specific apps & components.
- `server/`: Node/Express services and chatbot backend (Dialogflow + Google generative APIs). Key scripts:
  - `transactions.js` — transaction-related endpoints and handlers.
  - `server.js` — chatbot / socket server.
  - `pay.js` — payment-related helper using Razorpay.
- `smart_contracts/`: Solidity contracts, Foundry config, deployment & test scripts.
  - `src/ProductRegisry.sol` — main registry contract (note: filename in repo).
  - `src/TrackTransferHistory.sol` — transfer history tracking contract.
  - `script/DeployProductRegistry.s.sol` — deployment script.
  - `test/` — contract tests.

**Tech stack**

- Frontend: React 19, Vite, Tailwind, `html5-qrcode` / `qrcode.react` / `qr-scanner` for QR flows.
- Backend: Node.js, Express, Socket.IO, Dialogflow, Google generative API, Razorpay for payments.
- Blockchain: Solidity contracts (ERC-1155), Foundry tooling present (`foundry.toml`, `Makefile`).
- Storage: sample JSON and CSV datasets in `server/data/` (e.g., `produce.json`, crop datasets).

Why ERC-1155?

- ERC-1155 lets the system mint fungible and non-fungible token types in the same contract. We use tokens to represent batches; when a physical batch is split, token quantities are split, and each token instance (or id+amount) continues to represent that sub-batch, preserving provenance and enabling transfers.

QR-code flow (high level)

- A token/batch gets a QR generated (frontend uses `qrcode.react` / `qr-scanner`).
- Scanning a QR reads the token id / batch id and calls the backend or directly queries on-chain data via the DApp helper in `client/src/blockchain`.
- UI displays origin, transfer history, and verification status.

Agentic bot

- Implemented in `server/` using Dialogflow and Google generative APIs. It offers farmers:
  - Price insights and fair-price suggestions for crops.
  - Nearby market recommendations.
  - Multilingual support (see i18n modules in `client/src/*/i18n`).

Quick start

1. Frontend (development):

   ```powershell
   cd client
   npm install
   npm run dev
   ```

   - This starts the Vite dev server (open displayed URL to view the app).

2. Backend / Chatbot:

   ```powershell
   cd server
   npm install
   npm run start        # runs nodemon transactions.js
   npm run chatbot      # runs nodemon server.js (chatbot/socket server)
   ```

3. Smart contracts (Foundry / Forge):
   - If you have Foundry installed: from `smart_contracts/` run `forge build` and `forge test`.
   - There's a `Makefile` and `foundry.toml` to help with builds and deployments.

Notes & environment keys

- The server uses environment variables (`dotenv`) for API keys and credentials. Check `server/.env` (not in repo) or add one with keys for Dialogflow, Google APIs, and Razorpay.

Important files to inspect

- `client/src/blockchain/product_registry.js` — DApp client for interacting with contracts.
- `smart_contracts/src/ProductRegisry.sol` — ERC-1155 contract used for tokens.
- `script/DeployProductRegistry.s.sol` — deployment script for the registry contract.
- `server/server.js` and `server/transactions.js` — backend routing and chatbot integration.

Development tips

- If you plan to test end-to-end locally, run an Ethereum dev node (Anvil / Hardhat node / Ganache) and set the DApp config to point to it.
- Use Foundry/Forge for faster Solidity test runs: `forge test`.
- For contract deployments, adapt `script/DeployProductRegistry.s.sol` and set RPC keys in `.env`.

Contributing

- Please open issues or PRs for bugs/features. Keep changes small and focused. If you modify contracts, add or update tests in `smart_contracts/test/`.


