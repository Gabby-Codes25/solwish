/*import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOlWish",
  description: "Make your wish come through today",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} */

"use client";

//import type { Metadata } from "next";
import "./globals.css";
import WalletContextProvider from "./components/WalletProvider"; 

/*export const metadata: Metadata = {
  title: "SolWish",
  description: "Make your wish come through today",
}; */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}

