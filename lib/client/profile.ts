import { SupabaseClient } from "@supabase/supabase-js";

import AuthApp, { Profile } from ".";

export interface UpdateProfileDTO {
  display_name?: string;
  encryption_key?: string;
  decryption_key?: string;
}

export default class AuthAppProfileClient {
  private readonly app: AuthApp;
  private readonly supabase: SupabaseClient;

  constructor(app: AuthApp) {
    this.app = app;
    this.supabase = app.supabase;
  }

  async getProfile(): Promise<Profile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }

  async updateProfile(dto: UpdateProfileDTO): Promise<boolean> {
    const { error } = await this.supabase
      .from("profiles")
      .update(dto)
      .eq("id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
