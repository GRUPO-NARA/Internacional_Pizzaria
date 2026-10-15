import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://internacional-pizzaria.carlosrodriguesreal.chatgpt.site"),
  title: "Internacional | Pizzaria & Trattoria",
  description:
    "Pizza artesanal de fermentação lenta, ingredientes frescos e alma italiana.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Internacional | Pizzaria & Trattoria",
    description: "Pizza artesanal, unidades em São Luís e pedidos pelo WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
