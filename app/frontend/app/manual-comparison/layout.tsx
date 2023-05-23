import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manual Comparison Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
