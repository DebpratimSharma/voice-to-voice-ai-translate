// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// Using Inter, which is very similar to Roboto Flex used in M3
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Voice Translator",
  description: "AI Voice to Voice Translation",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} h-full`}>
        <TooltipProvider>
          <Navbar />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}