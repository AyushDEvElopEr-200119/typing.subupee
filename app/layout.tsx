import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://our.subupee.com"),
  title: { default: "Subupee Typing", template: "%s · Subupee Typing" },
  description: "Learn to type with a calm, direct interface. Lessons, tests, and games that stay with your hands.",
  applicationName: "Subupee Typing",
  openGraph: {
    siteName: "Subupee Typing",
    images: [{ url: "/brand/subupee-logo.webp", width: 960, height: 264, alt: "Subupee Typing" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
