"use client";

import { getLocalStorage, connect, disconnect, isConnected, openContractCall } from "@stacks/connect";
import { PostConditionMode } from "@stacks/transactions";
import { getRecordActivityTxOptions } from "@/lib/contract";
import { useEffect, useState } from "react";

type UserData = {
  addresses: {
    stx: { address: string }[];
    btc: { address: string }[];
  };
};

type Network = "mainnet" | "testnet" | null;

export function useStacks() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [network, setNetwork] = useState<Network>(null);

  function handleUserData(data: UserData | null) {
    if (data?.addresses?.stx?.[0]?.address) {
      const addr = data.addresses.stx[0].address;
      setNetwork(addr.startsWith("SP") ? "mainnet" : "testnet");
      setUserData(data);
    } else {
      setUserData(null);
      setNetwork(null);
    }
  }

  async function connectWallet() {
    try {
      await connect({
        ...(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID && {
          walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        }),
      });
      handleUserData(getLocalStorage());
    } catch (e) {
      console.error("Wallet connection failed:", e);
    }
  }

  function disconnectWallet() {
    disconnect();
    handleUserData(null);
  }

  /** Record one activity check-in on-chain. Returns txId or undefined if cancelled/failed. */
  async function recordActivity(): Promise<string | undefined> {
    if (typeof window === "undefined" || !userData || !network) return undefined;
    const txOptions = getRecordActivityTxOptions(network);
    return new Promise((resolve) => {
      openContractCall({
        ...txOptions,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: { txId: string }) => resolve(data.txId),
        onCancel: () => resolve(undefined),
      });
    });
  }

  useEffect(() => {
    if (isConnected()) handleUserData(getLocalStorage());
  }, []);

  return {
    userData,
    network,
    connectWallet,
    disconnectWallet,
    recordActivity,
    address: userData?.addresses?.stx?.[0]?.address ?? null,
  };
}
