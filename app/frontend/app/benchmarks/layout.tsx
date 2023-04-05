import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Current Benchmarks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}