import { fetchCallReadOnlyFunction, cvToJSON } from "@stacks/transactions";
import { REFLEX_CONTRACT_ADDRESS, REFLEX_CONTRACT_NAME } from "./contract";
import type { Network } from "./contract";

const EMPTY_PRINCIPAL = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export type LeaderboardEntry = { who: string; score: number };

export async function fetchLeaderboard(network: Network): Promise<LeaderboardEntry[]> {
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: REFLEX_CONTRACT_ADDRESS,
    contractName: REFLEX_CONTRACT_NAME,
    functionName: "get-leaderboard",
    functionArgs: [],
    senderAddress: REFLEX_CONTRACT_ADDRESS,
    network,
  });
  const json = cvToJSON(cv) as { value?: unknown[] };
  const list = Array.isArray(json) ? json : Array.isArray(json?.value) ? json.value : [];
  const out: LeaderboardEntry[] = [];
  for (const item of list) {
    const tuple = item && typeof item === "object" && "value" in item ? (item as { value: Record<string, unknown> }).value : item;
    if (tuple && typeof tuple === "object" && "who" in tuple && "score" in tuple) {
      const who = principalFromCV(tuple.who);
      const score = uintFromCV(tuple.score);
      if (who && who !== EMPTY_PRINCIPAL && score > 0) {
        out.push({ who, score });
      }
    }
  }
  return out.sort((a, b) => a.score - b.score);
}

function principalFromCV(cv: unknown): string | null {
  if (cv && typeof cv === "object" && "value" in cv) {
    const v = (cv as { value: unknown }).value;
    if (typeof v === "string") return v;
  }
  return null;
}

function uintFromCV(cv: unknown): number {
  if (cv && typeof cv === "object" && "value" in cv) {
    const v = (cv as { value: string }).value;
    if (typeof v === "string") return parseInt(v, 10) || 0;
  }
  return 0;
}
