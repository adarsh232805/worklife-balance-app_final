import "../styles/globals.css";
import { Outfit } from "next/font/google"; // Using a modern, clean font
import Providers from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "WorkLife+ | Balance Your Life",
  description: "A modern productivity and wellbeing application.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
