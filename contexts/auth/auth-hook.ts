import AuthApp from "@/lib/client";

export interface AuthHook {
  client: AuthApp;
  logged: boolean;
  authError: string | null;
}
