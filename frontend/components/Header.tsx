"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Lock } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Power Data, Locked for Safety
            </h1>
            <p className="text-sm text-muted-foreground">Secure Grid Consumption Log</p>
          </div>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
