"use client";

import { useStacks } from "@/hooks/use-stacks";
import { fetchSnakeState, type SnakeState } from "@/lib/activity";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const GRID_SIZE = 10;

export default function GamePage() {
  const { address, network, connectWallet, disconnectWallet, startGame, move } = useStacks();
  const [state, setState] = useState<SnakeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);

  const loadState = useCallback(async (): Promise<SnakeState | null> => {
    if (!address || !network) {
      setState(null);
      return null;
    }
    setLoading(true);
    try {
      const s = await fetchSnakeState(network, address);
      setState(s ?? null);
      return s ?? null;
    } catch (e) {
      console.error("Failed to load snake state:", e);
      setState(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [address, network]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    if (!address || !state?.alive) return;
    const handler = (e: KeyboardEvent) => {
      if (moving) return;
      let dir: 0 | 1 | 2 | 3 | null = null;
      switch (e.key) {
        case "ArrowUp":
          dir = 0;
          break;
        case "ArrowDown":
          dir = 1;
          break;
        case "ArrowLeft":
          dir = 2;
          break;
        case "ArrowRight":
          dir = 3;
          break;
      }
      if (dir !== null) {
        e.preventDefault();
        doMove(dir);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [address, state?.alive, moving]);

  async function handleStartGame() {
    if (!address) {
      toast.error("Connect wallet first");
      return;
    }
    setLoading(true);
    try {
      const txId = await startGame();
      if (txId) {
        toast.success("Game started! Use arrow keys or buttons to move.");
        await loadState();
      } else {
        toast.error("Transaction cancelled or failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function doMove(direction: 0 | 1 | 2 | 3) {
    if (!address || !state?.alive || moving) return;
    setMoving(true);
    try {
      const txId = await move(direction);
      if (txId) {
        const next = await loadState();
        if (next && !next.alive) toast.error("Hit the wall! Start a new game to play again.");
      } else {
        toast.error("Move cancelled or failed");
      }
    } finally {
      setMoving(false);
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-[#0a0e17] to-[#0f172a]">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-[#00d4aa] transition text-sm font-medium"
          >
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-[#00d4aa]">Snake Game</h1>
          <div className="w-14" />
        </div>

        {!address ? (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-400 mb-4">
              Connect your Stacks wallet to play the on-chain Snake game.
            </p>
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
                <p className="text-slate-400 text-center py-8">Loading...</p>
              ) : state === null ? (
                <div className="text-center py-6">
                  <p className="text-slate-400 mb-4">No game in progress. Start a new game.</p>
                  <button
                    onClick={handleStartGame}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] disabled:opacity-50 transition"
                  >
                    Start Game
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300">
                      Score: <strong className="text-[#00d4aa]">{state.score}</strong>
                    </span>
                    {!state.alive && (
                      <span className="text-red-400 font-medium">You died — start a new game</span>
                    )}
                  </div>

                  {/* 10x10 grid — contract uses 0..9 */}
                  <div
                    className="inline-grid gap-0.5 border border-slate-600 rounded-lg p-1 bg-slate-800/50"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                      aspectRatio: "1",
                      maxWidth: "320px",
                    }}
                  >
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                      const row = GRID_SIZE - 1 - Math.floor(i / GRID_SIZE);
                      const col = i % GRID_SIZE;
                      const contractY = GRID_SIZE - 1 - row;
                      const isSnake = state.alive && state.x === col && state.y === contractY;
                      return (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-sm ${
                            isSnake
                              ? "bg-[#00d4aa]"
                              : "bg-slate-700/50"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <p className="text-slate-500 text-xs mt-2">
                    Y-axis: bottom = 0, top = 9. Snake starts at (5, 5). Avoid the walls.
                  </p>

                  <div className="mt-4 flex flex-col items-center gap-2">
                    <button
                      onClick={() => doMove(0)}
                      disabled={!state.alive || moving}
                      className="w-12 h-10 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-bold"
                    >
                      ↑
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => doMove(2)}
                        disabled={!state.alive || moving}
                        className="w-12 h-10 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-bold"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => doMove(3)}
                        disabled={!state.alive || moving}
                        className="w-12 h-10 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-bold"
                      >
                        →
                      </button>
                    </div>
                    <button
                      onClick={() => doMove(1)}
                      disabled={!state.alive || moving}
                      className="w-12 h-10 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-bold"
                    >
                      ↓
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 text-center">
                    Or use arrow keys. Each move is an on-chain transaction.
                  </p>

                  {!state.alive && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleStartGame}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] disabled:opacity-50 transition"
                      >
                        Start New Game
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
