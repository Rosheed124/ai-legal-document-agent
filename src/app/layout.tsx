// Import Metadata type from Next.js for SEO and browser tab settings
import type { Metadata } from "next";
// Import global CSS styling rules
import "./globals.css";
// Import theme provider to enable client-side dark and light mode
import { ThemeProvider } from "@/components/theme-provider";

// Define website metadata for social sharing and search engines
export const metadata: Metadata = {
  // Browser tab title
  title: "LexAgent AI — Autonomous Legal Document Analyzer & Risk Auditor",
  // Meta description explaining the tool's purpose
  description: "AI-powered legal document analyzer that parses contracts, flags liability risks, generates plain-English compliance summaries, and proposes balanced counter-clauses. Built by Fagbenro Rosheed Iyiola.",
  // Author information
  authors: [{ name: "Fagbenro Rosheed Iyiola" }],
};

// Root layout component wrapping every page in the application
export default function RootLayout({
  children,
}: {
  // The page content to be rendered inside the layout
  children: React.ReactNode;
}) {
  return (
    // Set document language to English and suppress hydration warning for theme class
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-legal-canvas text-legal-text antialiased selection:bg-blue-500/20 selection:text-blue-500">
        {/* Wrap the app with ThemeProvider to enable toggling between light and dark themes */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
