import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a0e17] to-[#0f172a]">
      <h1 className="text-4xl font-bold text-[#00d4aa] mb-2">Stacks Reflex</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">
        Test your reaction time and compete on the on-chain leaderboard. Connect your Stacks wallet, play, and submit your best score.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/game"
          className="px-6 py-3 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] transition text-center"
        >
          Play game →
        </Link>
        <Link
          href="/ai"
          className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-800/50 transition text-center"
        >
          Activity
        </Link>
      </div>
    </main>
  );
}
