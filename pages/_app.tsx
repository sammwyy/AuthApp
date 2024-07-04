import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";

import Layout from "@/components/layout";
import { AuthProvider } from "@/contexts/auth";

import { ColorProvider } from "@/contexts/color";
import { DataProvider } from "@/contexts/data";

import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import "@/styles/main.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ColorProvider>
      <Toaster />

      {process.env.NODE_ENV !== "development" && <Analytics />}

      <AuthProvider>
        <DataProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DataProvider>
      </AuthProvider>
    </ColorProvider>
  );
}
