import type { Metadata } from "next";
import "./globals.css";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const assetBasePath = process.env.GITHUB_PAGES === "true" && repositoryName && !repositoryName.endsWith(".github.io")
  ? `/${repositoryName}`
  : "";

export const metadata: Metadata = {
  title: "Product Design English System",
  description: "A professional English learning map for Product Designers.",
  icons: {
    icon: `${assetBasePath}/favicon.svg`,
    shortcut: `${assetBasePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
