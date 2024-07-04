import { SupabaseClient } from "@supabase/supabase-js";
import AuthApp, { AuthAppError, Session } from ".";

export default class AuthAppAuthClient {
  private readonly app: AuthApp;
  private readonly supabase: SupabaseClient;
  private userId: string | null;

  constructor(app: AuthApp) {
    this.app = app;
    this.supabase = app.supabase;
    this.userId = null;

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        this.userId = session.user.id;

        if (event === "SIGNED_IN") {
          app.emit("login", {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        } else if (event === "SIGNED_OUT") {
          app.emit("logout");
        } else if (event === "USER_UPDATED") {
          app.emit("user_update", session.user.id);
        } else if (event === "PASSWORD_RECOVERY") {
          app.emit("password_recovery", session.user.id);
        } else if (event === "TOKEN_REFRESHED") {
          app.emit("token_refreshed", {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
        }
      } else {
        this.userId = null;
      }
    });

    this.getUserID = this.getUserID.bind(this);
    this.logout = this.logout.bind(this);
    this.resume = this.resume.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  getUserID() {
    return this.userId;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.app.emit("logout");
  }

  async resume(accessToken: string, refreshToken: string) {
    const { error } = await this.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw new AuthAppError("invalid_session", error.message);
    } else {
      return true;
    }
  }

  async login(email: string, password: string): Promise<Session> {
    const { error, data } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthAppError("invalid_credentials", error.message);
    }

    const { weakPassword, session } = data;
    if (weakPassword) {
      throw new AuthAppError("weak_password", "Password is too weak");
    }

    if (!session) {
      throw new AuthAppError("unknown", "No session returned");
    }

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    };
  }

  async register(email: string, password: string): Promise<Session> {
    const { error, data } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new AuthAppError("unknown", error.message);
    }

    const { session } = data;
    if (!session) {
      throw new AuthAppError("unknown", "No session returned");
    }

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    };
  }
}
