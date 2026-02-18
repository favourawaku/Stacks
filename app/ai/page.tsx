"use client";

import { useStacks } from "@/hooks/use-stacks";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

const DEFAULT_BATCH = 10;
const EXPLORER_TX = (txId: string, network: "mainnet" | "testnet") =>
  network === "mainnet"
    ? `https://explorer.hiro.so/txid/${txId}`
    : `https://explorer.hiro.so/txid/${txId}?chain=testnet`;

export default function AiPage() {
  const { address, network, connectWallet, disconnectWallet, recordActivity } = useStacks();
  const [batchCount, setBatchCount] = useState(DEFAULT_BATCH);
  const [sending, setSending] = useState(false);
  const [txIds, setTxIds] = useState<string[]>([]);

  const sendOne = useCallback(async () => {
    if (!address) {
      toast.error("Connect wallet first");
      return;
    }
    setSending(true);
    try {
      const txId = await recordActivity();
      if (txId) {
        toast.success("Activity recorded");
        setTxIds((prev) => [txId, ...prev].slice(0, 50));
      } else {
        toast.error("Recording cancelled or failed");
      }
    } finally {
      setSending(false);
    }
  }, [address, recordActivity]);

  const sendBatch = useCallback(async () => {
    if (!address) {
      toast.error("Connect wallet first");
      return;
    }
    setSending(true);
    const n = Math.max(1, Math.min(50, batchCount));
    let done = 0;
    const newIds: string[] = [];
    const toastId = toast.loading(`Recording 0 / ${n}...`);
    for (let i = 0; i < n; i++) {
      const txId = await recordActivity();
      if (txId) {
        done++;
        newIds.push(txId);
        toast.loading(`Recording ${done} / ${n}...`, { id: toastId });
      } else {
        toast.error(`Stopped at ${done} (cancelled)`);
        break;
      }
    }
    setTxIds((prev) => [...newIds, ...prev].slice(0, 50));
    setSending(false);
    toast.success(`Recorded ${done} activity`, { id: toastId });
  }, [address, recordActivity, batchCount]);

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
          <h1 className="text-2xl font-bold text-[#00d4aa]">Activity</h1>
          <div className="w-14" />
        </div>

        {!address ? (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-8 text-center">
            <p className="text-slate-400 mb-4">Connect your Stacks wallet to record activity on-chain.</p>
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

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={sendOne}
                  disabled={sending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {sending ? "Recording…" : "Record activity"}
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value) || 1)}
                    className="w-16 px-2 py-2 rounded-lg bg-slate-800 border border-slate-600 text-center text-white"
                  />
                  <span className="text-slate-400 text-sm">entries</span>
                </div>
                <button
                  onClick={sendBatch}
                  disabled={sending}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-medium hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {sending ? "Recording…" : "Record batch"}
                </button>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Each entry is recorded on-chain. Your wallet will prompt once per entry.
              </p>
            </div>

            {txIds.length > 0 && (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
                <h2 className="text-sm font-semibold text-slate-300 mb-3">Activity history</h2>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {txIds.map((id) => (
                    <li key={id} className="flex items-center gap-2 text-sm">
                      <a
                        href={network ? EXPLORER_TX(id, network) : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-cyan-400 hover:underline truncate flex-1"
                      >
                        {id.slice(0, 12)}...{id.slice(-8)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
