"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Eye } from "lucide-react";
import { useAccount } from "wagmi";

export interface ConsumptionRecord {
  id: number;
  timestamp: string;
  consumption: number | string;
  peak: boolean;
  reason: string;
  encrypted: boolean;
  isDecrypted?: boolean;
}

interface DataGridProps {
  data: ConsumptionRecord[];
  onDecrypt?: (recordId: number) => void;
  isDecrypting?: boolean;
}

const DataGrid = ({ data, onDecrypt, isDecrypting }: DataGridProps) => {
  const { isConnected } = useAccount();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Consumption Records
        </h2>
        <p className="text-sm text-muted-foreground">
          Encrypted peak data and outage reasons
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Timestamp
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Consumption
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Peak
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Reason
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr
                key={record.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-foreground">
                  {record.timestamp}
                </td>
                <td className="py-3 px-4 text-sm text-energy font-medium">
                  {record.isDecrypted || !record.encrypted
                    ? `${record.consumption} kWh`
                    : "****** kWh"}
                </td>
                <td className="py-3 px-4">
                  {record.peak ? (
                    <Badge
                      variant="default"
                      className="bg-encrypted text-primary-foreground"
                    >
                      Peak
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Normal</Badge>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  {record.encrypted && !record.isDecrypted && !isConnected ? (
                    <span className="text-muted-foreground italic flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Encrypted - Connect wallet to view
                    </span>
                  ) : record.encrypted && !record.isDecrypted ? (
                    <span className="text-muted-foreground italic flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Encrypted - Click decrypt to view
                    </span>
                  ) : (
                    record.reason
                  )}
                </td>
                <td className="py-3 px-4">
                  {record.encrypted && !record.isDecrypted ? (
                    <div className="flex items-center gap-2 text-encrypted text-sm">
                      <Lock className="w-4 h-4" />
                      Encrypted
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-primary text-sm">
                      <Unlock className="w-4 h-4" />
                      Open
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {record.encrypted && !record.isDecrypted && isConnected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDecrypt?.(record.id)}
                      disabled={isDecrypting}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {isDecrypting ? "Decrypting..." : "Decrypt"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isConnected && (
        <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Connect your wallet to access encrypted consumption data and outage
            reasons.
          </p>
        </div>
      )}
    </Card>
  );
};

export default DataGrid;
