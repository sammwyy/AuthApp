"use client";

import AuthApp, { AuthAppError } from "@/lib/client";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { AuthHook } from "./auth-hook";

const SingletonClient = new AuthApp({
  domain: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  api_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
});

export const AuthContext = React.createContext<AuthHook>({
  client: {} as AuthApp,
  authError: null,
  logged: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [logged, setLogged] = React.useState<boolean>(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const client = useMemo<AuthApp>(() => {
    const handleLogin = (session: {
      access_token: string;
      refresh_token: string;
    }) => {
      localStorage.setItem("access_token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);
      setLogged(true);
    };

    SingletonClient.removeAll();

    SingletonClient.on("login", handleLogin);

    SingletonClient.on("token_refreshed", handleLogin);

    SingletonClient.on("logout", () => {
      console.log("logout");
      setLogged(false);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("secure_encryption_key");
      localStorage.removeItem("secure_decryption_key");

      sessionStorage.removeItem("last_used_password");
      sessionStorage.removeItem("session_decryption_key");
      sessionStorage.removeItem("session_encryption_key");
    });

    return SingletonClient;
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      client.auth.resume(accessToken, refreshToken).catch((e: AuthAppError) => {
        setAuthError(e.kind);
      });
    }
  }, [client]);

  return (
    <AuthContext.Provider value={{ client, logged, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
