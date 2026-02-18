"use client";

import { getLocalStorage, connect, disconnect, isConnected, openContractCall } from "@stacks/connect";
import { PostConditionMode } from "@stacks/transactions";
import { getStartGameTxOptions, getMoveTxOptions, getSubmitScoreTxOptions } from "@/lib/contract";
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

  /** Start a new snake game on-chain. Returns txId or undefined if cancelled/failed. */
  async function startGame(): Promise<string | undefined> {
    if (typeof window === "undefined" || !userData || !network) return undefined;
    const txOptions = getStartGameTxOptions(network);
    return new Promise((resolve) => {
      openContractCall({
        ...txOptions,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: { txId: string }) => resolve(data.txId),
        onCancel: () => resolve(undefined),
      });
    });
  }

  /** Move snake: 0=up, 1=down, 2=left, 3=right. Returns txId or undefined. */
  async function move(direction: 0 | 1 | 2 | 3): Promise<string | undefined> {
    if (typeof window === "undefined" || !userData || !network) return undefined;
    const txOptions = getMoveTxOptions(network, direction);
    return new Promise((resolve) => {
      openContractCall({
        ...txOptions,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: { txId: string }) => resolve(data.txId),
        onCancel: () => resolve(undefined),
      });
    });
  }

  /** Submit reflex game score (reaction time in ms, lower = better). Returns txId or undefined. */
  async function submitScore(scoreMs: number): Promise<string | undefined> {
    if (typeof window === "undefined" || !userData || !network) return undefined;
    const txOptions = getSubmitScoreTxOptions(network, scoreMs);
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
    startGame,
    move,
    submitScore,
    address: userData?.addresses?.stx?.[0]?.address ?? null,
  };
}
