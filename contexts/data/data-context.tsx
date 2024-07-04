"use client";

import useAuth from "@/hooks/use-auth";
import { Namespace, Token } from "@/lib/client";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DataHook } from "./data-hook";

export const DataContext = React.createContext<DataHook>({
  namespaces: [],
  refresh: () => {},
  selectedNamespace: null,
  setSelectedNamespace: () => {},
  tokens: [],

  refreshTokens: () => {},
  refreshNamespaces: () => {},
});

export const DataProvider = ({ children }: PropsWithChildren) => {
  const { client, logged } = useAuth();
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<Namespace | null>(
    null
  );
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

  const refresh = useCallback(() => {
    refreshTokens();
    refreshNamespaces();
  }, [refreshNamespaces, refreshTokens]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DataContext.Provider
      value={{
        namespaces,
        refresh,
        selectedNamespace,
        setSelectedNamespace,
        tokens,
        refreshNamespaces,
        refreshTokens,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
