"use client";

import { usePathname } from "next/navigation";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        {!isAdminPage && <Navigation />}
        {children}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
