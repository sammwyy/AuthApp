import type { NextApiRequest } from "next";

import { BadRequestError, createHandler } from "@/lib/api";
import { createSupabase } from "@/lib/supabase";

async function getProfile(req: NextApiRequest) {
  const { supabase } = await createSupabase(req);
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    profile: data[0],
  };
}

async function updateProfile(req: NextApiRequest) {
  const { supabase, user } = await createSupabase(req);
  const { display_name, encryption_key, decryption_key } = req.body;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name, encryption_key, decryption_key })
    .eq("id", user?.id);

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Profile updated successfully",
  };
}

async function handler(req: NextApiRequest) {
  const method = req.method || "GET";

  switch (method) {
    case "GET":
      return await getProfile(req);
    case "POST":
      return await updateProfile(req);
  }
}

export default createHandler(handler, {
  methods: ["GET", "POST"],
});
