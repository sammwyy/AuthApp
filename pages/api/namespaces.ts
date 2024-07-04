import type { NextApiRequest } from "next";

import { BadRequestError, createHandler } from "@/lib/api";
import { createSupabase } from "@/lib/supabase";

async function createNamespace(req: NextApiRequest) {
  const { supabase } = await createSupabase(req);
  const { name } = req.body;

  const { error } = await supabase.from("namespaces").insert({
    name,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Namespace created successfully",
  };
}

async function getNamespaces(req: NextApiRequest) {
  const { supabase } = await createSupabase(req);
  const { data, error } = await supabase.from("namespaces").select("*");

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    namespaces: data,
  };
}

async function updateNamespace(req: NextApiRequest) {
  const { supabase, user } = await createSupabase(req);
  const { id } = req.query;
  const { name } = req.body;

  if (!id) {
    throw new BadRequestError("Namespace ID is required");
  }

  const { error } = await supabase
    .from("namespaces")
    .update({ name })
    .eq("id", id)
    .eq("user_id", user?.id);

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Namespace updated successfully",
  };
}

async function deleteNamespace(req: NextApiRequest) {
  const { supabase, user } = await createSupabase(req);
  const { id } = req.query;

  if (!id) {
    throw new BadRequestError("Namespace ID is required");
  }

  const { error } = await supabase
    .from("namespaces")
    .delete()
    .eq("id", id)
    .eq("user_id", user?.id);

  if (error) {
    throw new BadRequestError(error.message);
  }

  return {
    message: "Namespace deleted successfully",
  };
}

async function handler(req: NextApiRequest) {
  const method = req.method || "GET";

  switch (method) {
    case "GET":
      return getNamespaces(req);
    case "POST":
      return createNamespace(req);
    case "PATCH":
      return updateNamespace(req);
    case "DELETE":
      return deleteNamespace(req);
  }
}

export default createHandler(handler, {
  methods: ["GET", "POST", "PATCH", "DELETE"],
});
