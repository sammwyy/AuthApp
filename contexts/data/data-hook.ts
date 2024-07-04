import { Namespace, Token } from "@/lib/client";

export interface DataHook {
  // Namespaces.
  namespaces: Namespace[];
  selectedNamespace: Namespace | null;
  setSelectedNamespace: (namespace: Namespace) => void;

  // Tokens.
  tokens: Token[];

  // Functions.
  refresh: () => void;
  refreshTokens: () => void;
  refreshNamespaces: () => void;
}
