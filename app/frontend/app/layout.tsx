import Link from "next/link";
import Navbar from "./Navbar";
import "@picocss/pico/css/pico.min.css";
import "./globals.css";


export const metadata = {
  title: "GPU & CPU Price Comparer",
  description: "Compare the Price/Performance Score of different GPUs and CPUs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <main className="container">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
