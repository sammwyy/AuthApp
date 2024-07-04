import { SupabaseClient } from "@supabase/supabase-js";

import AuthApp, { Token } from ".";

export interface CreateTokenDTO {
  namespace: string;
  name: string;
  icon: string;
  interval: 30 | 60;
  type: "totp" | "hotp";
  token: string;
}

export type UpdateTokenDTO = Partial<CreateTokenDTO>;

export default class AuthAppTokensClient {
  private readonly app: AuthApp;
  private readonly supabase: SupabaseClient;

  constructor(app: AuthApp) {
    this.app = app;
    this.supabase = app.supabase;
  }

  async createToken(dto: CreateTokenDTO): Promise<boolean> {
    const { error } = await this.supabase.from("tokens").insert({ ...dto });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async getTokens(): Promise<Token[]> {
    const { data, error } = await this.supabase
      .from("tokens")
      .select("*")
      .eq("user_id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateToken(id: string, dto: UpdateTokenDTO): Promise<boolean> {
    const { error } = await this.supabase
      .from("tokens")
      .update(dto)
      .eq("id", id)
      .eq("user_id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async deleteToken(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("tokens")
      .delete()
      .eq("id", id)
      .eq("user_id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
