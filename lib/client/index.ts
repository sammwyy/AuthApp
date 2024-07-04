import { SupabaseClient, createClient } from "@supabase/supabase-js";
import AuthAppAuthClient from "./auth";
import Emitter from "./emitter";
import AuthAppNamespacesClient from "./namespaces";
import AuthAppProfileClient from "./profile";
import AuthAppTokensClient from "./tokens";

export interface AuthAppSettings {
  domain: string;
  api_key: string;
  auth?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface Session {
  access_token: string;
  refresh_token: string;
}

export interface Profile {
  id: string;
  display_name: string;
  encryption_key: string;
  decryption_key: string;
}

export interface Namespace {
  id: string;
  name: string;
}

export interface Token {
  id: string;
  namespace: string;
  name: string;
  icon: string;
  interval: 30 | 60;
  type: "totp" | "hotp";
  token: string;
}

export type AuthAppErrorKind =
  | "unknown"
  | "invalid_credentials"
  | "invalid_session"
  | "weak_password";

export class AuthAppError extends Error {
  constructor(public kind: AuthAppErrorKind, message: string) {
    super(message);
  }
}

export type AuthAppEvent =
  | "login"
  | "logout"
  | "user_update"
  | "password_recovery"
  | "token_refreshed";

export default class AuthApp extends Emitter<AuthAppEvent> {
  public readonly supabase: SupabaseClient;
  public readonly auth: AuthAppAuthClient;
  public readonly namespaces: AuthAppNamespacesClient;
  public readonly profile: AuthAppProfileClient;
  public readonly tokens: AuthAppTokensClient;

  constructor(settings: AuthAppSettings) {
    super();

    this.supabase = createClient(settings.domain, settings.api_key, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    this.auth = new AuthAppAuthClient(this);
    this.namespaces = new AuthAppNamespacesClient(this);
    this.profile = new AuthAppProfileClient(this);
    this.tokens = new AuthAppTokensClient(this);
  }
}
