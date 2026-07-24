import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BankAgent — Agentic AI for Payments, Operations & Compliance",
  description: "Enterprise AI assistant platform for banking operations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
