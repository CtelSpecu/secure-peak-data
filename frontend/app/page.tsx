"use client";

import { useCallback } from "react";
import Header from "@/components/Header";
import ConsumptionGraph, {
  ConsumptionDataPoint,
} from "@/components/ConsumptionGraph";
import DataGrid, { ConsumptionRecord } from "@/components/DataGrid";
import CreateEntryDialog from "@/components/CreateEntryDialog";
import Footer from "@/components/Footer";
import { useAccount } from "wagmi";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useSecurePeakData } from "@/hooks/useSecurePeakData";
import { toast } from "@/hooks/use-toast";

// Initial graph data for visualization
const initialGraphData: ConsumptionDataPoint[] = [
  { time: "00:00", consumption: 420, encrypted: false },
  { time: "04:00", consumption: 380, encrypted: false },
  { time: "08:00", consumption: 920, encrypted: true },
  { time: "12:00", consumption: 1100, encrypted: true },
  { time: "16:00", consumption: 850, encrypted: false },
  { time: "20:00", consumption: 780, encrypted: true },
];

export default function Home() {
  const { isConnected } = useAccount();
  const { provider } = useMetaMask();
  const {
    ethersSigner,
    ethersReadonlyProvider,
    chainId,
    sameChain,
    sameSigner,
  } = useMetaMaskEthersSigner();
  const { storage } = useInMemoryStorage();
  const { instance } = useFhevm({
    provider,
    chainId,
  });

  const {
    records,
    graphData,
    isCreating,
    isDecrypting,
    createRecord,
    decryptRecord,
    isDeployed,
  } = useSecurePeakData({
    instance,
    fhevmDecryptionSignatureStorage: storage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  const handleCreateEntry = useCallback(
    async (entry: {
      timestamp: string;
      consumption: number;
      peak: boolean;
      reason: string;
      encrypted: boolean;
    }) => {
      if (!isConnected) {
        toast({
          title: "Wallet Required",
          description: "Please connect your wallet to create entries",
          variant: "destructive",
        });
        return;
      }

      try {
        await createRecord(entry.consumption, entry.peak);
        toast({
          title: "Entry Created",
          description: "Consumption record has been added to the blockchain",
        });
      } catch (error) {
        console.error("Create entry error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create entry. Please try again.",
          variant: "destructive",
        });
      }
    },
    [isConnected, createRecord]
  );

  const handleDecrypt = useCallback(
    async (recordId: number) => {
      if (!isConnected) {
        toast({
          title: "Wallet Required",
          description: "Please connect your wallet to decrypt data",
          variant: "destructive",
        });
        return;
      }

      try {
        await decryptRecord(recordId);
        toast({
          title: "Decryption Complete",
          description: "Record data has been decrypted",
        });
      } catch (error) {
        console.error("Decrypt error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to decrypt record. Please try again.",
          variant: "destructive",
        });
      }
    },
    [isConnected, decryptRecord]
  );

  // Use contract data if available, otherwise use initial data
  const displayGraphData =
    graphData.length > 0 ? graphData : initialGraphData;
  const displayRecords: ConsumptionRecord[] =
    records.length > 0
      ? records
      : [
          {
            id: 0,
            timestamp: "2025-01-15 08:00",
            consumption: 920,
            peak: true,
            reason: "Morning industrial surge",
            encrypted: true,
            isDecrypted: false,
          },
          {
            id: 1,
            timestamp: "2025-01-15 12:00",
            consumption: 1100,
            peak: true,
            reason: "Peak demand period",
            encrypted: true,
            isDecrypted: false,
          },
          {
            id: 2,
            timestamp: "2025-01-15 16:00",
            consumption: 850,
            peak: false,
            reason: "Standard operation",
            encrypted: false,
            isDecrypted: true,
          },
        ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Power Data, Locked for Safety
              </h1>
              <p className="text-sm text-muted-foreground">
                Secure grid consumption monitoring system
                {!isDeployed && chainId && (
                  <span className="text-destructive ml-2">
                    (Contract not deployed on this network)
                  </span>
                )}
              </p>
            </div>
            <CreateEntryDialog
              onCreateEntry={handleCreateEntry}
              isCreating={isCreating}
            />
          </div>
          <ConsumptionGraph data={displayGraphData} />
          <DataGrid
            data={displayRecords}
            onDecrypt={handleDecrypt}
            isDecrypting={isDecrypting}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
