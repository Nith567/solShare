"use client";
import { useEffect, useState,useContext } from "react";
import { useParams } from "next/navigation";
import { SelectedWalletAccountContext } from "@/solana/context/SelectedWalletAccountContext";
import SolConnect from "@/solana/components/fileshareConnecteWallet";
import SolanaMiddlewarePayment from '../../../solana/components/solanaMiddlewarePayment';
type FileShare = {
  id: string;
  title: string;
  metadata: string;
  price: string;
  owner: string;
  cid: string;
};



export default function FileDetailPage() {
  const { id } = useParams();
  const [file, setFile] = useState<FileShare | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedAccount] = useContext(SelectedWalletAccountContext); 

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
    return <div className="flex justify-center items-center h-screen text-red-500">File not found ⚠️</div>;

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

        <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded mb-6">
          {file.cid.endsWith(".jpg") || file.cid.endsWith(".png") ? (
            <img
              src={`https://ipfs.io/ipfs/${file.cid}`}
              alt="IPFS file"
              className="w-full rounded"
            />
          ) : (
            <a
              href={`https://ipfs.io/ipfs/${file.cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 underline text-sm"
            >
              🔗 View IPFS File
            </a>
          )}
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
