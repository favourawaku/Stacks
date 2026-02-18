import { uintCV } from "@stacks/transactions";

/**
 * Contract call options.
 * Activity: NEXT_PUBLIC_CONTRACT_ADDRESS / NEXT_PUBLIC_CONTRACT_NAME (default "activity").
 * Reflex game: NEXT_PUBLIC_REFLEX_CONTRACT_ADDRESS / NEXT_PUBLIC_REFLEX_CONTRACT_NAME (default "reflex").
 */

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || "activity";

const REFLEX_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_REFLEX_CONTRACT_ADDRESS || CONTRACT_ADDRESS;
const REFLEX_CONTRACT_NAME = process.env.NEXT_PUBLIC_REFLEX_CONTRACT_NAME || "reflex";

export { CONTRACT_ADDRESS, CONTRACT_NAME, REFLEX_CONTRACT_ADDRESS, REFLEX_CONTRACT_NAME };

export type Network = "mainnet" | "testnet";

export function getRecordActivityTxOptions(network: Network) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "record-activity",
    functionArgs: [],
    network,
  };
}

export function getSubmitScoreTxOptions(network: Network, scoreMs: number) {
  return {
    contractAddress: REFLEX_CONTRACT_ADDRESS,
    contractName: REFLEX_CONTRACT_NAME,
    functionName: "submit-score",
    functionArgs: [uintCV(Math.round(scoreMs))],
    network,
  };
}
