import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lights Camera Learn",
  description: "International filmmaking education internship program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="stylesheet" href="/styles/sqs-site.css" />
        <link rel="stylesheet" href="/styles/sqs-commerce.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
