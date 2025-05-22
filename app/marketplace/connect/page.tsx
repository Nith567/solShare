"use client";
import { useContext } from "react";
import { SelectedWalletAccountContext } from "@/solana/context/SelectedWalletAccountContext";
import SolanaWalletConnector from "@/solana/components/SolanaWalletConnector";

export default function ConnectWalletPage() {
  const [selectedAccount] = useContext(SelectedWalletAccountContext);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black">
      <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-zinc-800 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Connect Your Solana Wallet</h1>
        <SolanaWalletConnector />
        {selectedAccount && (
          <div className="mt-6 text-center">
            <p className="text-gray-700 dark:text-gray-200">Connected Address:</p>
            <p className="font-mono text-blue-600 dark:text-blue-400 break-all">{selectedAccount.address}</p>
          </div>
        )}
      </div>
    </div>
  );
} 