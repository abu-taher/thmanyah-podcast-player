import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "../contexts/audio-context";
import AudioPlayer from "../components/audio/audio-player";
import { SidebarProvider } from "../contexts/sidebar-context";
import { SharedSidebar } from "../components/layout/shared-sidebar";
import { HeaderNavigation } from "../components/layout/header-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thmanyah - Podcast Player",
  description: "Discover and listen to your favorite podcasts with Thmanyah",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AudioProvider>
          <SidebarProvider>
            <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
              <SharedSidebar />
              <div className="flex-1 flex flex-col min-w-0 w-full md:w-auto">
                <HeaderNavigation />
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
            <AudioPlayer />
          </SidebarProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
