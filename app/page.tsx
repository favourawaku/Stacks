import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a0e17] to-[#0f172a]">
      <h1 className="text-4xl font-bold text-[#00d4aa] mb-2">Stacks Activity</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">
        Record your activity on-chain. Connect your wallet and use the Activity dashboard to log check-ins.
      </p>
      <Link
        href="/ai"
        className="px-6 py-3 rounded-xl bg-[#00d4aa] text-[#0a0e17] font-semibold hover:bg-[#00f5c4] transition"
      >
        Open Activity →
      </Link>
    </main>
  );
}
