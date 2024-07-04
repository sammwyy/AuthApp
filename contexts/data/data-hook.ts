import { Namespace, Profile, Token } from "@/lib/client";

export interface DataHook {
  // Namespaces.
  namespaces: Namespace[];
  selectedNamespace: Namespace | null;
  setSelectedNamespace: (namespace: Namespace) => void;

  // Tokens.
  tokens: Token[];

  // Profile.
  profile: Profile | null;

  // Functions.
  refresh: () => void;
  refreshTokens: () => void;
  refreshNamespaces: () => void;
  refreshProfile: () => void;
}
