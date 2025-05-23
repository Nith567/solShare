"use client";

import { useState, useContext, useCallback, forwardRef } from "react";
import { SelectedWalletAccountContext } from "../context/SelectedWalletAccountContext";
import TransactionStatus from "@/components/TransactionStatus";
import { UiWalletAccount } from "@wallet-standard/react";
import { createPayment } from "@bit-gpt/h402";
import { createProxiedSolanaRpc } from "../lib/proxiedSolanaRpc";
import { PaymentClient } from "@bit-gpt/h402/types";
import { mapTxError } from "@/lib/mapTxError";
import {
  useWalletAccountTransactionSendingSigner
} from "@solana/react";

// Payment specific interface
export interface solanaMiddlewarePaymentProps {
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  id?: string; // Add prompt parameter for redirection
  PurchaseMetadata: any;
}

// Payment Processing Component - handles payment functionality
const solanaMiddlewarePayment = forwardRef<
  HTMLButtonElement,
  solanaMiddlewarePaymentProps
>(({  isProcessing, setIsProcessing, id, PurchaseMetadata }, ref) => {
  // Get the selected wallet account from context
  const [selectedAccount] = useContext(SelectedWalletAccountContext);

  // Payment state
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [txHash, setTxHash] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const transactionSendingSigner = useWalletAccountTransactionSendingSigner(
    selectedAccount as UiWalletAccount,
    "solana:mainnet"
  );

  /*
  const transactionSigner = useWalletAccountTransactionSigner(
    selectedAccount as UiWalletAccount,
    "solana:mainnet"
  );i
  */

  // Handle payment submission
  const handlePayment = useCallback(async (): Promise<void> => {
    if ( !selectedAccount) {
      console.log("Payment not valid");
      return Promise.resolve();
    }

    try {
      setIsProcessing(true);
      setPaymentStatus("processing");
      setStatusMessage(""); // Clear any previous error messages

      const dynamicSolanaPaymentDetails = {
        ...PurchaseMetadata,
        resource: `solana-image-${Date.now()}`,
      };

      // Create the proxied Solana RPC client
      const proxiedRpc = createProxiedSolanaRpc();

      const paymentClient: PaymentClient = {
        solanaClient: {
          // Use the connected account address
          publicKey: selectedAccount.address,
          // Provide the proxied RPC client
          rpc: proxiedRpc,
          signAndSendTransaction:
            transactionSendingSigner.signAndSendTransactions,
          //signTransaction: transactionSigner.modifyAndSignTransactions,
        },
      };

      // Create the payment
      const paymentHeader = await createPayment(
        dynamicSolanaPaymentDetails,
        paymentClient
      );

      // Set transaction hash if available from the payment process
      if (
        paymentHeader &&
        typeof paymentHeader === "string" &&
        paymentHeader.includes(":")
      ) {
        const hashPart = paymentHeader.split(":").pop();
        if (hashPart) {
          setTxHash(hashPart);
        }
      }

      setPaymentStatus("paid"); // Using "paid" to match TransactionStatus component

      // If we have a id, redirect to the image generation API
      if (id) {
        console.log(
          "Payment successful! Redirecting directly to sharing file.."
        );

        // Redirect directly to the image generation API endpoint
        window.location.href = `/api/ipfs-share?id=${encodeURIComponent(id.trim())}&402base64=${encodeURIComponent(
          paymentHeader
        )}`;
      } else {
        setIsProcessing(false);
      }
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage = mapTxError(
        error instanceof Error ? error : { message: String(error) }
      );
      setStatusMessage(`Error: ${errorMessage}`);
      setPaymentStatus("failed");
      setIsProcessing(false);
    }
    return Promise.resolve();
  }, [
    isProcessing,
    selectedAccount,
    setIsProcessing,
    transactionSendingSigner.signAndSendTransactions,
    id,
    PurchaseMetadata
  ]);

  // Used by the hidden button to determine if payment can be processed
  const canProcessPayment = selectedAccount 

  return (
    <div className="space-y-4">
      {selectedAccount && (
        <button
          ref={ref}
          onClick={handlePayment}
          disabled={!canProcessPayment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Pay with Solana
        </button>
      )}

      {/* Transaction Status */}
      {paymentStatus !== "idle" && (
        <TransactionStatus txHash={txHash} status={paymentStatus} />
      )}

      {/* Error message display */}
      {statusMessage && (
        <div className="text-red-500 text-sm mt-2">{`statusmessageanta`}{statusMessage}</div>
      )}
    </div>
  );
});

solanaMiddlewarePayment.displayName = "solanaMiddlewarePayment";

export default solanaMiddlewarePayment;
