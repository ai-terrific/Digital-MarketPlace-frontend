# PHX Marketplace

PHX Marketplace is a web3 digital marketplace built with React, TypeScript, and
Vite. It connects to MetaMask and the Ethereum Sepolia testnet to browse and
manage product listings, and uses Pimlico for smart-account transactions.

## Features

- Browse the marketplace and view product details.
- Create listings, reactivate inactive products you own, and manage your products.
- Connect a MetaMask wallet on Sepolia.
- View wallet and account information.
- Access marketplace administration features, including fee management.
- Use smart-account transactions through Pimlico.

## Requirements

- Node.js 18 or newer
- npm
- MetaMask, when using wallet features
- Sepolia test ETH for transactions that require gas

## Getting started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env.local` file in the project root and set the configuration
   values described below.

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Configuration

The application reads the following Vite environment variables:

| Variable | Purpose |
| --- | --- |
| `VITE_MARKETPLACE_CONTRACT_ADDRESS` | Marketplace contract address |
| `VITE_PHX_TOKEN_ADDRESS` | PHX token contract address |
| `VITE_SEPOLIA_RPC_URL` | RPC endpoint for Ethereum Sepolia |
| `VITE_PIMLICO_API_KEY` | Pimlico API key used for smart-account transactions |

Example `.env.local`:

```dotenv
VITE_MARKETPLACE_CONTRACT_ADDRESS=0xYourMarketplaceContractAddress
VITE_PHX_TOKEN_ADDRESS=0xYourPhxTokenAddress
VITE_SEPOLIA_RPC_URL=https://your-sepolia-rpc-endpoint
VITE_PIMLICO_API_KEY=your-pimlico-api-key
```

The app has fallback values in `src/constants/config.ts`. Set your own
configuration in `.env.local` for local development, and do not commit API keys
or other private credentials. Vite bundles `VITE_` variables into client-side
code, so they must not contain secrets that need to remain private.

The configured marketplace contract must support this frontend's fee model:
`listingFee()` and owner-only `setListingFee(uint256)` for the PHX fee charged
on product creation, plus `platformFeeBps()` for the buyer fee. Its purchase
implementation must collect the product price and percentage fee from the
buyer while transferring the full listed price to the seller. Deploy a
contract implementing this behavior before using the updated fee controls; the
frontend cannot enforce seller payouts by itself.

The backend API base URL is also configured in `src/constants/config.ts`. Its
current environment lookup uses `REACT_APP_API_BASE_URL`; Vite does not expose
`REACT_APP_` variables by default. To override the API URL through the
environment, update the application to use a `VITE_`-prefixed variable (or
configure Vite's `envPrefix`) first.

## Available routes

| Path | Page |
| --- | --- |
| `/` | Marketplace |
| `/product/:id` | Product details |
| `/create` | Create a product listing |
| `/my-products` | Your product listings |
| `/account` | Wallet and account |
| `/admin` | Marketplace administration |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Build the production app into `dist/` |
| `npm run typecheck` | Run the TypeScript type checker |
| `npm run lint:error` | Run ESLint and report errors |

## Project structure

- `src/pages/` — Marketplace, product, account, and administration pages.
- `src/components/` — Shared UI components.
- `src/context/` — React contexts, including wallet state.
- `src/services/` — Backend API and marketplace service functions.
- `src/web3/` — Contract and smart-account integration.
- `src/abi/` — Smart contract ABI artifacts.
- `src/constants/` — App configuration, routes, and shared constants.
