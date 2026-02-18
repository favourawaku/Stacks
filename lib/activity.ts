import { fetchCallReadOnlyFunction, cvToJSON, principalCV } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "./contract";
import type { Network } from "./contract";

export type SnakeState = {
  x: number;
  y: number;
  score: number;
  alive: boolean;
};

function parseUint(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "object" && v !== null && "value" in v) {
    const val = (v as { value: string }).value;
    return parseInt(String(val), 10) || 0;
  }
  return parseInt(String(v), 10) || 0;
}

function parseBool(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "object" && v !== null && "value" in v)
    return (v as { value: boolean }).value === true;
  return Boolean(v);
}

/** Fetch a player's snake game state from the activity contract (get-state). */
export async function fetchSnakeState(
  network: Network,
  principal: string
): Promise<SnakeState | null> {
  const cv = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-state",
    functionArgs: [principalCV(principal)],
    senderAddress: principal,
    network,
  });
  const json = cvToJSON(cv) as { value?: Record<string, unknown> } | null;
  if (!json) return null;
  const inner = json.value ?? json;
  if (!inner || typeof inner !== "object") return null;
  const data = (inner as Record<string, unknown>).data ?? inner;
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  return {
    x: parseUint(d.x),
    y: parseUint(d.y),
    score: parseUint(d.score),
    alive: parseBool(d.alive),
  };
}
