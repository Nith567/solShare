"use client";
import { UiWallet, useDisconnect } from "@wallet-standard/react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
// import SolanaWalletConnector from "@/solana/components/SolanaWalletConnector";
export interface SolanaConnectedWalletPanelProps {
  connectedAddress: string;
  statusMessage: string;
  wallet: UiWallet;
  onDisconnected: () => void;
  disabled?: boolean;
}

export function SolanaConnectedWalletPanel({
  connectedAddress,
  statusMessage,
  wallet,
  onDisconnected,
  disabled = false,
}: SolanaConnectedWalletPanelProps) { 
  const [, disconnect] = useDisconnect(wallet);
  const [cid, setCid] = useState("");
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false); // enable fields after upload
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState("");
  const [price, setPrice] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  const uploadFile = async () => {
    if (!file) return toast.error("No file selected ");
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const res = await axios.post("/api/files", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCid(res.data);
      setUploaded(true);
      toast.success("File uploaded!");
    } catch (err) {
      toast.error("Failed to upload file");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
   const res=await axios.post("/api/save", {
        title,
        metadata,
        price,
        cid,
        owner: connectedAddress,
      });
      setDialogOpen(false);
      toast.success("Saved successfully");
      // reset state
      setCid("");
      setFile(undefined);
      setUploaded(false);
      setTitle("");
      setMetadata("");
      setPrice("");
      router.push(`/marketplace/${res.data.id}`);
    } catch {
      toast.error("Save failed bro ");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onDisconnected();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  return (
    <div className="card mb-6 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-primary">Wallet Connected</p>
          <p className="text-sm text-blue-text font-mono">
            {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={disabled}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Upload File & Register
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
            <Dialog.Title className="text-2xl font-bold mb-4">Upload & Register</Dialog.Title>
            <form onSubmit={handleDialogSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Select File</label>
                <input type="file" onChange={handleFileChange} required />
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={uploading}
                  onClick={uploadFile}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {uploaded && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Metadata</label>
                    <input
                      value={metadata}
                      onChange={(e) => setMetadata(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Price (in SOL)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 border rounded">Cancel</button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={!uploaded}
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {statusMessage && <p className="text-secondary">{statusMessage}</p>}
    </div>
  );
}
