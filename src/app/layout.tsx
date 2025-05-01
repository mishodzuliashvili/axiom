import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WithNavbarAndFooter from "./_components/navigation/WithNavbarAndFooter";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://axiom.ge"),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      siteName: "BeExample",
      url: "https://axiom.ge",
    },
    authors: [
      {
        name: "Misho Dzuliashvili – Full Stack Engineer",
        url: "https://github.com/mishodzuliashvili",
      },
      {
        name: "Luka Trapaidze – Frontend & UI/UX",
        url: "https://github.com/I-Bumblebee",
      },
      {
        name: "Luka Oniani – Backend & Infra Engineer",
        url: "https://github.com/lukabatoni",
      },
    ],
    category: "productivity",
    title: "Axiom",
    description:
      "Axiom is a real-time, end-to-end encrypted collaboration tool built for teams, and creators who value privacy, speed, and control. Every action is synchronized instantly using WebSockets, and your data is encrypted client-side—ensuring only you and your collaborators can access it.",
    keywords: [
      "real-time collaboration",
      "encrypted workspace",
      "end-to-end encryption",
      "WebSocket sync",
      "private team workspace",
      "developer tools",
      "secure collaboration",
      "collaboration platform",
      "privacy-first app",
      "encrypted notes",
      "team productivity",
      "secure messaging",
      "Axiom app",
      "collaborative editor",
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <WithNavbarAndFooter>
          {children}
          <Toaster />
        </WithNavbarAndFooter>
      </body>
    </html>
  );
}
