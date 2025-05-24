"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

type FileShare = {
  id: string;
  title: string;
  metadata: string;
  price: string;
  owner: string;
  cid: string;
};

export default function MarketplacePage() {
  const [files, setFiles] = useState<FileShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("/api/fileshare"); // Your API endpoint
        setFiles(res.data);
      } catch (err) {
        console.error("Failed to fetch bro", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">📁 Marketplace</h1>

      {loading ? (
        <p className="text-gray-500">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-gray-500">No files listed yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {files.map((file) => (
            <Link
              href={`/marketplace/${file.id}`}
              key={file.id}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900"
            >
              <div className="mb-3">
                {file.cid.endsWith(".jpg") || file.cid.endsWith(".png") ? (
                  <img
                    src={`https://ipfs.io/ipfs/${file.cid}`}
                    alt={file.title}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-600">
                    📁 {file.title}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold">{file.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{file.metadata}</p>
              <p className="text-blue-600 font-semibold">💰 {file.price} SOL</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
