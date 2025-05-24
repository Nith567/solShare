"use client";
import { useEffect, useState,useContext } from "react";
import { useParams } from "next/navigation";
import { SelectedWalletAccountContext } from "@/solana/context/SelectedWalletAccountContext";
import SolConnect from "@/solana/components/fileshareConnecteWallet";
import SolanaMiddlewarePayment from '../../../solana/components/solanaMiddlewarePayment';
import { QRCodeCanvas } from "qrcode.react";

type FileShare = {
  id: string;
  title: string;
  metadata: string;
  price: string;
  owner: string;
};

export default function FileDetailPage() {
  const { id } = useParams();
  const [file, setFile] = useState<FileShare | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedAccount] = useContext(SelectedWalletAccountContext); 
  // Generate the full URL for this file
  const url = typeof window !== 'undefined' ? `${window.location.origin}/marketplace/${id}` : '';

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/fileshare/${id}`);
        const data = await res.json();
        if (res.ok) setFile(data);
        else console.error("Failed", data.error);
      } catch (err) {
        console.error("Fetch error ", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFile();
  }, [id]);

  if (loading)
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading file info...</div>;
  if (!file)
    return <div className="flex justify-center items-center h-screen text-red-500"> ...</div>;

   const solanaPaymentDetails = {
    scheme: "exact",
    namespace: "solana",
    networkId: "mainnet",
    amountRequired: file.price,
    amountRequiredFormat: "formatted" as const,
    tokenAddress: "11111111111111111111111111111111", // System Program ID for native SOL
    resource: "Pay for Content",
    description: file.metadata,
    mimeType: "application/json",
    outputSchema: null,
    payToAddress: "HZsKA5oQCtnXXUCCc4bXmFuyijJC5eydCoFQGSz9XgaV",
    estimatedProcessingTime: 5,
    extra: null,
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black px-4">
      <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{file.title}</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-2">🧾 {file.metadata}</p>
        <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">💰 {file.price} SOL</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">📦 Uploaded by: {file.owner}</p>

        {/* QR Code Generator Section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Share this file</div>
          <QRCodeCanvas value={url} size={180} bgColor="#fff" fgColor="#2E74FF" includeMargin={true} />
          <div className="mt-2 text-xs text-gray-500 break-all text-center">{url}</div>
        </div>

        <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded mb-6">
          {selectedAccount ? (
            <SolanaMiddlewarePayment
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              id={id as string}
              PurchaseMetadata={solanaPaymentDetails}
            />
          ) : (
            <SolConnect />
          )}
        </div>

      </div>
    </div>
  );
}
