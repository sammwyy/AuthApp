"use client";

import useAuth from "@/hooks/use-auth";
import { Namespace, Profile, Token } from "@/lib/client";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DataHook } from "./data-hook";

export const DataContext = React.createContext<DataHook>({
  namespaces: [],
  profile: null,
  refresh: () => {},
  selectedNamespace: null,
  setSelectedNamespace: () => {},
  tokens: [],

  refreshTokens: () => {},
  refreshNamespaces: () => {},
  refreshProfile: () => {},
});

export const DataProvider = ({ children }: PropsWithChildren) => {
  const { client, logged } = useAuth();
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<Namespace | null>(
    null
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);

  const refreshTokens = useCallback(() => {
    if (logged) {
      console.log("Refreshing tokens");
      client.tokens.getTokens().then(setTokens);
    }
  }, [client, logged]);

  const refreshNamespaces = useCallback(() => {
    if (logged) {
      console.log("Refreshing namespaces");
      client.namespaces.getNamespaces().then((namespaces) => {
        setNamespaces(namespaces);
        setSelectedNamespace(namespaces[0] ?? null);
      });
    }
  }, [client, logged]);

  const refreshProfile = useCallback(() => {
    if (logged) {
      console.log("Refreshing profile");
      client.profile.getProfile().then(setProfile);
    }
  }, [client, logged]);

  const refresh = useCallback(() => {
    refreshTokens();
    refreshNamespaces();
    refreshProfile();
  }, [refreshNamespaces, refreshProfile, refreshTokens]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DataContext.Provider
      value={{
        namespaces,
        profile,
        refresh,
        selectedNamespace,
        setSelectedNamespace,
        tokens,
        refreshNamespaces,
        refreshProfile,
        refreshTokens,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
