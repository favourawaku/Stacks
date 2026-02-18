"use client";

import { useStacks } from "@/hooks/use-stacks";
import { fetchSnakeState, type SnakeState } from "@/lib/activity";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function AiPage() {
  const { address, network, connectWallet, disconnectWallet } = useStacks();
  const [state, setState] = useState<SnakeState | null | "none">(null);
  const [loading, setLoading] = useState(false);

  const loadState = useCallback(async () => {
    if (!address || !network) {
      setState(null);
      return;
    }
    setLoading(true);
    try {
      const s = await fetchSnakeState(network, address);
      setState(s ?? "none");
    } catch (e) {
      console.error("Failed to load snake state:", e);
      setState("none");
    } finally {
      setLoading(false);
    }
  }, [address, network]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-[#0a0e17] to-[#0f172a]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-slate-400 hover:text-[#00d4aa] transition text-sm font-medium"
          >
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-[#00d4aa]">Your game state</h1>
          <div className="w-14" />
        </div>

        {!address ? (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-400 mb-4">
              Connect your Stacks wallet to see your on-chain Snake game state.
            </p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm font-mono truncate max-w-[240px]" title={address}>
                {address.slice(0, 8)}...{address.slice(-8)}
              </p>
              <span className="text-xs text-slate-500 uppercase">{network ?? ""}</span>
              <button
                onClick={disconnectWallet}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Disconnect
              </button>
            </div>

            {loading ? (
              <p className="text-slate-400 py-4">Loading...</p>
            ) : state === null ? (
              <p className="text-slate-400 py-4">Checking state...</p>
            ) : state === "none" ? (
              <div className="py-4">
                <p className="text-slate-400 mb-4">No game in progress. Start a game to see your state here.</p>
                <Link
                  href="/game"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-medium hover:bg-[#00f5c4] transition"
                >
                  Play Snake →
                </Link>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <p className="text-slate-300">
                  Position: <span className="font-mono text-[#00d4aa]">({state.x}, {state.y})</span>
                </p>
                <p className="text-slate-300">
                  Score: <span className="font-mono text-[#00d4aa]">{state.score}</span>
                </p>
                <p className="text-slate-300">
                  Status:{" "}
                  <span className={state.alive ? "text-emerald-400" : "text-red-400"}>
                    {state.alive ? "Alive" : "Dead"}
                  </span>
                </p>
                <Link
                  href="/game"
                  className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-slate-600 text-white font-medium hover:bg-slate-500 transition"
                >
                  {state.alive ? "Continue game" : "Start new game"} →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
