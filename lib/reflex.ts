import { fetchCallReadOnlyFunction, cvToJSON, principalCV } from "@stacks/transactions";
import { REFLEX_CONTRACT_ADDRESS, REFLEX_CONTRACT_NAME } from "./contract";
import type { Network } from "./contract";

/** Fetch a principal's best score (ms) from the reflex contract. */
export async function fetchBestScore(
  network: Network,
  principal: string
): Promise<number> {
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: REFLEX_CONTRACT_ADDRESS,
    contractName: REFLEX_CONTRACT_NAME,
    functionName: "get-best-score",
    functionArgs: [principalCV(principal)],
    senderAddress: principal,
    network,
  });
  const json = cvToJSON(cv) as { value?: string };
  const raw = json?.value ?? json;
  if (typeof raw === "string") return parseInt(raw, 10) || 0;
  return 0;
}
