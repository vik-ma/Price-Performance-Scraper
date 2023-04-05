import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Additional Information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}