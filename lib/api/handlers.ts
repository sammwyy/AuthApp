import type { NextApiRequest, NextApiResponse } from "next";
import { HTTPError, MethodNotAllowedError } from "./errors";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HTTPResult =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | undefined;

type HandlerSettings = {
  methods?: HTTPMethod | HTTPMethod[];
};

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse
) => HTTPResult | Promise<HTTPResult>;

async function runHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: Handler,
  settings: HandlerSettings
) {
  // Check if the method is allowed:
  if (
    settings.methods &&
    !settings.methods.includes(req.method as HTTPMethod)
  ) {
    res.setHeader("Allow", settings.methods);
    throw new MethodNotAllowedError("Method Not Allowed");
  }

  const result = await handler(req, res);
  return result;
}

export function createHandler(handler: Handler, settings?: HandlerSettings) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Catch error:
    try {
      // Run the handler:
      const result = await runHandler(req, res, handler, settings || {});

      // Get the status code:
      const method = req.method as HTTPMethod;
      const statusCode = result == null ? 204 : method === "POST" ? 201 : 200;
      res.status(statusCode);

      // Send the result:
      if (result === null) {
        res.end();
      } else if (typeof result === "object") {
        res.json(result);
      } else {
        res.send(result);
      }
    } catch (e) {
      let error = e as HTTPError;

      if ("toJSON" in error) {
        res.status(error.status).json(error);
      } else {
        console.error(e);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      }
    }
  };
}
