"use client";

import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [meterReading, setMeterReading] = useState<number | null>(null);

  useEffect(() => {
    setMeterReading(Math.floor(Math.random() * 10000) + 50000);
  }, []);

  return (
    <footer className="border-t border-border bg-card mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-energy" />
            <span>Energy Meter: #{meterReading ?? "-----"}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Secure Grid Consumption Log - 2025
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
