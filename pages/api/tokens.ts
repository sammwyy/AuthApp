import type { NextApiRequest } from "next";

import { BadRequestError, createHandler } from "@/lib/api";
import { createSupabase } from "@/lib/supabase";

async function createToken(req: NextApiRequest) {
  const { supabase } = await createSupabase(req);
  const { namespace, name, icon, interval, type, token } = req.body;

  const { error } = await supabase.from("tokens").insert({
    namespace,
    name,
    icon,
    interval,
    type,
    token,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Token created successfully",
  };
}

async function getTokens(req: NextApiRequest) {
  const { supabase, user } = await createSupabase(req);
  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("user_id", user?.id);

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    tokens: data,
  };
}

async function updateToken(req: NextApiRequest) {
  const { supabase, user } = await createSupabase(req);
  const { id } = req.query;
  const { namespace, name, icon, interval, type, token } = req.body;

  if (!id) {
    throw new BadRequestError("Namespace ID is required");
  }

  const { error } = await supabase
    .from("tokens")
    .update({ namespace, name, icon, interval, type, token })
    .eq("id", id)
    .eq("user_id", user?.id);

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Token updated successfully",
  };
}

async function deleteToken(req: NextApiRequest) {
  const { supabase, user } = await createSupabase(req);
  const { id } = req.query;

  if (!id) {
    throw new BadRequestError("Token ID is required");
  }

  const { error } = await supabase
    .from("tokens")
    .delete()
    .eq("id", id)
    .eq("user_id", user?.id);

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Token deleted successfully",
  };
}

async function handler(req: NextApiRequest) {
  const method = req.method || "GET";

  switch (method) {
    case "POST":
      return createToken(req);
    case "GET":
      return getTokens(req);
    case "PATCH":
      return updateToken(req);
    case "DELETE":
      return deleteToken(req);
  }
}

export default createHandler(handler, {
  methods: ["GET", "POST", "PATCH", "DELETE"],
});
