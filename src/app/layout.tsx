import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";
import ChatAssistant from "@/components/ChatAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AppForge AI | Build Apps with AI",
  description: "Describe your app idea and let AI build it for you. Create, generate, and deploy projects from natural language prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17695929412"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17695929412');
            `,
          }}
        />
      </head>
      <body className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          {children}
          <ChatAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
