# Hardhat Test Network Setup

## What is Hardhat?

Hardhat is a development environment for Ethereum that includes a local blockchain network for testing. The default Hardhat network runs on:

- **RPC URL**: `http://localhost:8545`
- **Chain ID**: `31337`
- **Network Name**: `hardhat` or `localhost`

## Quick Start

### 1. Install Hardhat

```bash
npm install --save-dev hardhat
```

### 2. Initialize Hardhat (if not already done)

```bash
npx hardhat init
```

### 3. Start the Hardhat Network

In a terminal, run:

```bash
npx hardhat node
```

This will:
- Start a local Ethereum node on `http://localhost:8545`
- Display 20 test accounts with private keys
- Each account is pre-funded with 10,000 ETH (test tokens)

### 4. Configure Your Frontend

Update your `.env` file in `frontend/web/`:

```env
VITE_PIXELGENESIS_CHAIN_ID=31337
VITE_PIXELGENESIS_RPC_URL=http://localhost:8545
```

### 5. Add Hardhat Network to MetaMask

1. Open MetaMask
2. Go to Settings → Networks → Add Network
3. Add the following:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://localhost:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`

4. Import a test account:
   - Copy one of the private keys from the Hardhat node output
   - In MetaMask: Account menu → Import Account → Paste private key

## Hardhat Configuration

Create `hardhat.config.js` in your project root:

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
};
```

## Test Networks Available

### 1. **Hardhat Local Network** (Default)
- **RPC**: `http://localhost:8545`
- **Chain ID**: `31337`
- **Use Case**: Local development and testing
- **Start**: `npx hardhat node`

### 2. **Hardhat Fork** (Fork mainnet/testnet)
- Fork any network for testing
- **Example**: `npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY`

### 3. **Public Testnets** (Already configured in your app)
- **Sepolia**: Chain ID `11155111`
- **Mumbai (Polygon)**: Chain ID `80001` (currently in your config)

## Commands

```bash
# Start local node
npx hardhat node

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

## Connecting Your App

Your frontend already has `localhost` configured in `web3Client.ts`. Just:

1. Start Hardhat: `npx hardhat node`
2. Update `.env` with chain ID `31337`
3. Connect MetaMask to the Hardhat network
4. Your app will automatically connect!

## Troubleshooting

**Can't connect to Hardhat?**
- Make sure `npx hardhat node` is running
- Check the RPC URL is `http://localhost:8545`
- Verify chain ID is `31337`

**MetaMask not connecting?**
- Make sure you've added the Hardhat network
- Check you're using the correct chain ID (31337)
- Try resetting MetaMask account (Settings → Advanced → Reset Account)

