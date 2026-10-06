import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

export const metadata: Metadata = {
  title: "AWS Route53 Management Console",
  description: "Clone of AWS Route53 Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f2f3f3] text-gray-900 font-sans min-h-screen flex flex-col">
        <TopNav />
        <div className="flex flex-1">
          <SideNav />
          <main className="flex-1 p-6 overflow-x-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
