"use client";

import React, { useState, useCallback, useRef, useContext } from "react";
import ImagePromptInput from "@/components/ImagePromptInput";
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
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="w-full max-w-[800px] mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-2">
          402 pay Image Generation Example
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-8">
          Connect your Solana wallet, enter a prompt, and pay a small fee to generate
          an AI image using the HTTP 402 payment protocol.
        </p>
        <SolanaPaymentComponents
          isPromptValid={isPromptValid}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          onWalletConnectionChange={handleSolanaWalletConnectionChange}
          buttonRef={solanaPaymentButtonRef}
          walletConnected={solanaWalletConnected}
          prompt={imagePrompt}
        />
        <ImagePromptInput
          value={imagePrompt}
          onChange={handlePromptChange}
          disabled={isProcessing}
          minLength={MIN_PROMPT_LENGTH}
          paymentMethod={"solana"}
          walletConnected={walletConnected}
          isProcessing={isProcessing}
          canProcessPayment={canProcessPayment}
          onGenerateImage={handleGenerateImage}
        />
      </div>
    </div>
  );
}
