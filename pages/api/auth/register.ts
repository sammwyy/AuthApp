import type { NextApiRequest } from "next";

import { BadRequestError, createHandler } from "@/lib/api";
import { createSupabaseAnon } from "@/lib/supabase";

async function handler(req: NextApiRequest) {
  const supabase = createSupabaseAnon();
  const { email, password } = req.body;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message:
      "User registered successfully. Please check your email to confirm your account.",
  };
}

export default createHandler(handler, {
  methods: "POST",
});
