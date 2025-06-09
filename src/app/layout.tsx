import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { TRPCProvider } from "@/utils/trpc";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arakoo Chat",
  description: "A mobile-focused ChatGPT clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <TRPCProvider>
            <Toaster position="top-right" />
            {children}
          </TRPCProvider>
        </UserProvider>
      </body>
    </html>
  );
}
