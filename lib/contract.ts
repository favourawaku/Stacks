import { uintCV } from "@stacks/transactions";

/**
 * Contract call options.
 * Activity (Snake game): NEXT_PUBLIC_CONTRACT_ADDRESS / NEXT_PUBLIC_CONTRACT_NAME (default "activity").
 * Reflex game: NEXT_PUBLIC_REFLEX_CONTRACT_ADDRESS / NEXT_PUBLIC_REFLEX_CONTRACT_NAME (default "reflex").
 */

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "SPBQFVD2Q0FH3KV9ZEEF2Z0XPKTTYD57918V48FD";
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || "activity";

const REFLEX_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_REFLEX_CONTRACT_ADDRESS || CONTRACT_ADDRESS;
const REFLEX_CONTRACT_NAME = process.env.NEXT_PUBLIC_REFLEX_CONTRACT_NAME || "reflex";

export { CONTRACT_ADDRESS, CONTRACT_NAME, REFLEX_CONTRACT_ADDRESS, REFLEX_CONTRACT_NAME };

export type Network = "mainnet" | "testnet";

/** Snake game: start a new game on-chain. */
export function getStartGameTxOptions(network: Network) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "start-game",
    functionArgs: [],
    network,
  };
}

/** Snake game: move direction 0=up, 1=down, 2=left, 3=right. */
export function getMoveTxOptions(network: Network, direction: number) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "move",
    functionArgs: [uintCV(direction)],
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
