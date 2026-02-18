# Wallet integration (main project)

This app uses **Stacks Connect** (`@stacks/connect`) for wallet connection (Leather, Xverse, or any Stacks wallet; mobile via WalletConnect when project ID is set).

## Env setup

1. Copy env: `cp .env.example .env`
2. In `.env`:
   - **Contract:** `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_CONTRACT_NAME` (Snake game).
   - **WalletConnect (optional):** `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` from [WalletConnect Cloud](https://cloud.walletconnect.com). If empty, desktop Leather/Xverse still work.

All client vars must use the `NEXT_PUBLIC_` prefix.

## Where it’s used

- **`useStacks()`** (`hooks/use-stacks.ts`): `userData`, `network`, `address`, `connectWallet()`, `disconnectWallet()`, `startGame()`, `move()`, `submitScore()`.
- **Home** (`app/page.tsx`): Links to game and “Your game state”.
- **Game** (`app/game/page.tsx`): Connect → Start game → move with arrows or buttons; each move is an on-chain tx.
- **Your game state** (`app/ai/page.tsx`): Reads on-chain snake state for the connected address.

## Connect flow

1. User clicks Connect (on any page that shows it).
2. Stacks Connect opens (Leather, Xverse, or WalletConnect QR).
3. After approval, `userData` is set; navbar/pages show address and Disconnect.

Restart the dev server after changing `.env`.
