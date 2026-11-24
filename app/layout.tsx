import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({ src: "./fonts/Geist-Regular.ttf", display: "swap" });

export const metadata: Metadata = {
  title: "AM HVAC — Heating, ventilation and air conditioning in the UAE",
  description:
    "HVAC installation, maintenance, repair and air distribution for residential, commercial and industrial buildings across the UAE.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
