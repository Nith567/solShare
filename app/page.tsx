"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Paywall from "@/components/Paywall";

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const base64Payment = searchParams.get("402base64");
  const prompt = searchParams.get("prompt");

  if (base64Payment && prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-[800px] mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Solshare</h1>
          <p className="text-lg mb-8">
            A platform for creators to monetize their content with pay-per-use powered by <span className="text-[#9945FF] font-semibold">Solana</span>
          </p>
        </div>
      </div>
    );
  }

  // Otherwise, render the Paywall component directly
  return <Paywall />;
}

export default function HomePage() {
  const isMounted = useIsMounted();
  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-[800px] mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Solshare</h1>
          <p className="text-lg mb-8">
            A platform for creators to monetize their content with pay-per-use powered by <span className="text-[#9945FF] font-semibold">Solana</span>
          </p>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-[800px] mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Solshare</h1>
          <p className="text-lg mb-8">
            A platform for creators to monetize their content with pay-per-use powered by <span className="text-[#9945FF] font-semibold">Solana</span>
          </p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
