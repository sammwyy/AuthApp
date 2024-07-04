import type { NextApiRequest } from "next";

import { BadRequestError, createHandler } from "@/lib/api";
import { createSupabaseAnon } from "@/lib/supabase";

async function handler(req: NextApiRequest) {
  const supabase = createSupabaseAnon();
  const { email, password } = req.body;

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  const { user, session } = data;

  return {
    user,
    session,
    message: "Logged in successfully",
  };
}

export default createHandler(handler, {
  methods: "POST",
});
