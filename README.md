# Stacks Activity

Next.js app + Clarity contract for on-chain activity tracking. Record check-ins from the Activity dashboard. Deploy the contract, set your contract address in env, then use the app to record activity.

## Contract

- **Path:** `contracts/activity.clar`
- **Function:** `record-activity` — records a single check-in on-chain (increments total count; no STX transfer, minimal cost).
- **Read-only:** `get-total-check-ins` — returns the total number of recorded activities.

### Deploy the contract

**Option A – Clarinet (local / testnet)**

```bash
# From project root
clarinet contract deploy activity --network testnet
# Use the deployed contract address in .env
```

**Option B – Hiro / manual**

1. Copy `contracts/activity.clar` into the Hiro Sandbox or your deployment flow.
2. Deploy to testnet or mainnet.
3. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_CONTRACT_NAME` in `.env.local`.

## App

- **Home:** `/` — intro and link to Activity dashboard.
- **Activity:** `/ai` — connect wallet, record a single activity or a batch of entries. Activity history with explorer links.

### Setup

```bash
cp .env.example .env.local
# Edit .env.local with your contract address and name (after deploy)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Open Activity** → connect wallet → record activity.

### Env vars

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Your deployed contract principal (e.g. `ST1PQH...`) |
| `NEXT_PUBLIC_CONTRACT_NAME` | Contract name (default: `activity`) |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | Optional; for WalletConnect in connect modal |
