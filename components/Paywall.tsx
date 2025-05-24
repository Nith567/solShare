"use client";

import React, { useState, useCallback, useRef, useContext } from "react";
import SolanaWalletConnector from "@/solana/components/SolanaWalletConnector";
import SolanaPaymentProcessor from "@/solana/components/SolanaPaymentProcessor";
import { SelectedWalletAccountContext } from "@/solana/context/SelectedWalletAccountContext";

const MIN_PROMPT_LENGTH = 3;

// Create a combined Solana payment components wrapper
function SolanaPaymentComponents({
  isPromptValid,
  isProcessing,
  setIsProcessing,
  buttonRef,
  walletConnected,
  prompt,
  onWalletConnectionChange,
}: {
  isPromptValid: () => boolean;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  walletConnected: boolean;
  prompt: string;
  onWalletConnectionChange: (isConnected: boolean) => void;
}) {
  const [selectedAccount] = useContext(SelectedWalletAccountContext);
  const isWalletFullyConnected = walletConnected && !!selectedAccount;

  return (
    <div className="space-y-6">
      <SolanaWalletConnector onWalletConnectionChange={onWalletConnectionChange} />
      {isWalletFullyConnected && (
        <SolanaPaymentProcessor
          isPromptValid={isPromptValid}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          prompt={prompt}
        />
      )}
    </div>
  );
}

export default function Paywall() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [solanaWalletConnected, setSolanaWalletConnected] = useState(false);
  const [canProcessPayment, setCanProcessPayment] = useState(false);
  const solanaPaymentButtonRef = useRef<HTMLButtonElement | null>(null);

  const isPromptValid = useCallback(() => {
    return imagePrompt.trim().length >= MIN_PROMPT_LENGTH;
  }, [imagePrompt]);

  // Only Solana wallet connection state
  const walletConnected = solanaWalletConnected;

  // Update canProcessPayment when relevant state changes
  React.useEffect(() => {
    setCanProcessPayment(walletConnected && isPromptValid() && !isProcessing);
  }, [walletConnected, isPromptValid, isProcessing]);

  const handlePromptChange = useCallback((value: string) => {
    setImagePrompt(value);
  }, []);

  const handleSolanaWalletConnectionChange = useCallback((isConnected: boolean) => {
    setSolanaWalletConnected(isConnected);
  }, []);

  const handleGenerateImage = useCallback(async () => {
    if (!canProcessPayment) return Promise.resolve();
    if (solanaPaymentButtonRef.current) {
      solanaPaymentButtonRef.current.click();
    }
    return Promise.resolve();
  }, [canProcessPayment]);

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black px-4">
  <div className="w-full max-w-3xl mx-auto py-12 px-6 md:px-12 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl bg-white dark:bg-[#0d0d0d]">
    <h1 className="text-4xl font-bold text-center mb-4 text-black dark:text-white">
      🚀 Solshare
    </h1>
    <p className="text-center text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
      A platform for creators to monetize their content with pay-per-use powered by <span className="text-[#9945FF] font-semibold">Solana</span>
    </p>

    <div className="flex flex-col space-y-6">
      <SolanaPaymentComponents
        isPromptValid={isPromptValid}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        onWalletConnectionChange={handleSolanaWalletConnectionChange}
        buttonRef={solanaPaymentButtonRef}
        walletConnected={solanaWalletConnected}
        prompt={imagePrompt}
      />
    </div>
  </div>
</div>

  );
}
