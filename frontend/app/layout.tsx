import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Secure Grid Consumption Log - Power Data, Locked for Safety",
  description: "Energy providers store encrypted consumption peaks and outage reasons for authorized auditors. Connect your wallet to access secure energy data.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
