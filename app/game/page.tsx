"use client";

import { useStacks } from "@/hooks/use-stacks";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/reflex";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type GameState = "idle" | "waiting" | "go" | "done";

export default function GamePage() {
  const { address, network, connectWallet, disconnectWallet, submitScore } = useStacks();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const [goAt, setGoAt] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLb, setLoadingLb] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    if (!network) return;
    setLoadingLb(true);
    try {
      const entries = await fetchLeaderboard(network);
      setLeaderboard(entries);
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
      toast.error("Could not load leaderboard");
    } finally {
      setLoadingLb(false);
    }
  }, [network]);

  useEffect(() => {
    loadLeaderboard();
    const t = setInterval(loadLeaderboard, 15000);
    return () => clearInterval(t);
  }, [loadLeaderboard]);

  useEffect(() => {
    if (gameState !== "waiting") return;
    setReactionMs(null);
    setGoAt(null);
    const delay = 1500 + Math.random() * 2500;
    const timer = setTimeout(() => {
      setGoAt(Date.now());
      setGameState("go");
    }, delay);
    return () => clearTimeout(timer);
  }, [gameState]);

  const handleClick = useCallback(() => {
    if (gameState === "idle") {
      setGameState("waiting");
      return;
    }
    if (gameState === "go" && goAt) {
      const ms = Math.round(Date.now() - goAt);
      setReactionMs(ms);
      setGameState("done");
      return;
    }
    if (gameState === "waiting") {
      toast.error("Too early! Wait for GO.");
      setGameState("idle");
    }
  }, [gameState, goAt]);

  const handleSubmit = useCallback(async () => {
    if (!address || reactionMs == null || reactionMs <= 0) return;
    setSubmitting(true);
    try {
      const txId = await submitScore(reactionMs);
      if (txId) {
        toast.success("Score submitted on-chain!");
        loadLeaderboard();
      } else {
        toast.error("Submission cancelled or failed");
      }
    } finally {
      setSubmitting(false);
    }
  }, [address, reactionMs, submitScore, loadLeaderboard]);

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-[#0a0e17] via-[#0d1321] to-[#0f172a]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-slate-400 hover:text-[#00d4aa] transition text-sm font-medium"
          >
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-[#00d4aa]">Stacks Reflex</h1>
          <div className="w-14" />
        </div>

        <p className="text-slate-400 text-center mb-8">
          Click when you see GO. Lower reaction time (ms) = better. Submit your best to the on-chain leaderboard.
        </p>

        {!address ? (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-400 mb-4">Connect your Stacks wallet to play and submit scores.</p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-mono truncate max-w-[200px]" title={address}>
                  {address.slice(0, 6)}...{address.slice(-6)}
                </p>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
                className={`
                  select-none rounded-xl min-h-[200px] flex flex-col items-center justify-center
                  transition-all duration-150 cursor-pointer
                  ${gameState === "idle" ? "bg-slate-800/80 hover:bg-slate-700/80 border-2 border-dashed border-slate-600" : ""}
                  ${gameState === "waiting" ? "bg-amber-950/50 border-2 border-amber-700/60" : ""}
                  ${gameState === "go" ? "bg-emerald-950/60 border-2 border-[#00d4aa]" : ""}
                  ${gameState === "done" ? "bg-slate-800/80 border border-slate-600" : ""}
                `}
              >
                {gameState === "idle" && (
                  <span className="text-slate-300 text-lg font-medium">Click to start</span>
                )}
                {gameState === "waiting" && (
                  <span className="text-amber-400/90 text-lg font-medium">Wait for it...</span>
                )}
                {gameState === "go" && (
                  <span className="text-[#00d4aa] text-3xl font-bold tracking-wide">GO!</span>
                )}
                {gameState === "done" && reactionMs != null && (
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">{reactionMs} ms</span>
                    <p className="text-slate-400 text-sm mt-1">Click area to play again</p>
                  </div>
                )}
              </div>

              {gameState === "done" && reactionMs != null && reactionMs > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? "Submitting…" : "Submit score on-chain"}
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
                Leaderboard (top 10)
                <button
                  onClick={loadLeaderboard}
                  disabled={loadingLb}
                  className="text-xs text-[#00d4aa] hover:underline disabled:opacity-50"
                >
                  {loadingLb ? "Loading…" : "Refresh"}
                </button>
              </h2>
              {leaderboard.length === 0 && !loadingLb && (
                <p className="text-slate-500 text-sm">No scores yet. Be the first!</p>
              )}
              <ul className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <li
                    key={`${entry.who}-${entry.score}-${i}`}
                    className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-slate-800/50"
                  >
                    <span className="text-slate-400 font-medium w-6">#{i + 1}</span>
                    <span className="font-mono text-slate-300 truncate flex-1 mx-2" title={entry.who}>
                      {entry.who.slice(0, 8)}...{entry.who.slice(-6)}
                    </span>
                    <span className="text-[#00d4aa] font-semibold">{entry.score} ms</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
