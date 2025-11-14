# Transfer Ownership Guide

If you don't have the deployer's private key, you can transfer ownership to your account using this script.

## Quick Solution

The script uses Hardhat's default deployer account (which is always the same) to transfer ownership to your address.

### Step 1: Make sure Hardhat node is running

```bash
npm run node
```

Keep this terminal open.

### Step 2: Transfer ownership to your address

In a **new terminal**, run:

```bash
npm run transfer-ownership 0x90f79bf6eb2c4f870365e785982e1f101e93b906
```

Replace `0x90f79bf6eb2c4f870365e785982e1f101e93b906` with your actual address (the one you see in the dashboard: `0x90f7...b906`).

**Note:** No `--` needed! Just run `npm run transfer-ownership` followed by your address.

### Step 3: Refresh the dashboard

After the transfer completes:
1. Refresh your browser page
2. You should now see that you are the contract owner
3. You can now add issuers and verifiers!

## Alternative: Manual Command

If the npm script doesn't work, use:

```bash
npx hardhat run scripts/transferOwnership.js --network localhost -- 0x90f79bf6eb2c4f870365e785982e1f101e93b906
```

## What the script does

1. Connects to your local Hardhat network
2. Uses the deployer account (account 0) - this is a well-known Hardhat account
3. Calls `setOwner()` on the RoleManager contract
4. Transfers ownership to your specified address
5. Verifies the transfer was successful

## Troubleshooting

**Error: "Deployer account is not the current owner"**
- This means the contract was deployed with a different account
- Check the Hardhat node terminal to see which account deployed the contracts
- You may need to use that account's private key instead

**Error: "Invalid address"**
- Make sure you're using a valid Ethereum address (starts with 0x, 42 characters)
- Copy the address exactly from MetaMask or the dashboard

**Transaction fails**
- Make sure Hardhat node is running
- Check that the deployer account has ETH (it should have 10000 ETH by default)

