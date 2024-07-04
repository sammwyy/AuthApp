import { SupabaseClient } from "@supabase/supabase-js";

import AuthApp, { Namespace } from ".";

export interface CreateNamespaceDTO {
  name: string;
}

export type UpdateNamespaceDTO = Omit<CreateNamespaceDTO, "name">;

export default class AuthAppNamespacesClient {
  private readonly app: AuthApp;
  private readonly supabase: SupabaseClient;

  constructor(app: AuthApp) {
    this.app = app;
    this.supabase = app.supabase;
  }

  async createNamespace(dto: CreateNamespaceDTO): Promise<boolean> {
    const { error } = await this.supabase.from("namespaces").insert({ ...dto });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async getNamespaces(): Promise<Namespace[]> {
    const { data, error } = await this.supabase
      .from("namespaces")
      .select("*")
      .eq("user_id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateNamespace(id: string, dto: UpdateNamespaceDTO): Promise<boolean> {
    const { error } = await this.supabase
      .from("namespaces")
      .update(dto)
      .eq("id", id)
      .eq("user_id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async deleteNamespace(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("namespaces")
      .delete()
      .eq("id", id)
      .eq("user_id", this.app.auth.getUserID());

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
