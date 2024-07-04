import Layout from "@/components/layout";
import { AuthProvider } from "@/contexts/auth";
import { AppProps } from "next/app";

import { ColorProvider } from "@/contexts/color";
import { DataProvider } from "@/contexts/data";
import { EncryptionProvider } from "@/contexts/encryption";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ColorProvider>
      <AuthProvider>
        <DataProvider>
          <EncryptionProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </EncryptionProvider>
        </DataProvider>
      </AuthProvider>
    </ColorProvider>
  );
}
