import type { NextApiRequest } from "next";

import { createClient } from "@supabase/supabase-js";
import { UnauthorizedError } from "./api";

const DOMAIN = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createSupabase(req: NextApiRequest) {
  const client = createSupabaseAnon();
  const access_token = (req.headers.authorization || "").split(" ")[1];
  const refresh_token = req.headers["x-refresh-token"] as string;

  if (!access_token) {
    throw new UnauthorizedError("No authorization token provided");
  }

  if (!refresh_token) {
    throw new UnauthorizedError("No refresh token provided");
  }

  const { error, data } = await client.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    throw new UnauthorizedError(error.message);
  }

  return { supabase: client, user: data.user, session: data.session };
}

export function createSupabaseAnon() {
  return createClient(DOMAIN as string, ANON_KEY as string);
}
