import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Stacks Reflex",
  description: "Reaction-time game with an on-chain leaderboard on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" },
            success: { iconTheme: { primary: "#10b981" } },
            error: { iconTheme: { primary: "#ef4444" } },
          }}
        />
      </body>
    </html>
  );
}
