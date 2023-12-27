/* eslint-disable no-console */

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { ZodError } from "zod";

import { ErrorResponse } from "@/types";

/**
 * Wrapper for the base Next.js API handler to provide default error handling.
 * @param handler Object containing HTTP methods and its handler.
 * @returns
 */
export default function apiHandler(
  handler: Record<
    string,
    (req: NextApiRequest, res: NextApiResponse) => unknown
  >
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase();

    // check handler supports HTTP method
    if (!method || !handler[method]) {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
      // run the handler
      await handler[method](req, res);
    } catch (err) {
      errorHandler(err, res);
    }
  };
}

function errorHandler(err: unknown, res: NextApiResponse<ErrorResponse>) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.errors });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // default to 500 server error
  console.error(err); // TODO: Could possibly log this somewhere else other than console logging.
  return res.status(500).end();
}
