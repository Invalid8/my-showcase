import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/context/ScrollContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dalgoridim - Showcase",
  description: "A showcase of my work and projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
