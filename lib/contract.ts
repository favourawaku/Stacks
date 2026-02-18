/**
 * Activity contract call options.
 * Set NEXT_PUBLIC_CONTRACT_ADDRESS and NEXT_PUBLIC_CONTRACT_NAME after deploying.
 */

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || "activity";

export { CONTRACT_ADDRESS, CONTRACT_NAME };

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
