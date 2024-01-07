import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { HttpStatusCode } from "axios";

import apiHandler from "@/lib/api-handler";
import userService from "@/services/user";
import { User } from "@/types";

export default apiHandler({
  get: getUser
});

async function getUser(req: NextApiRequest, res: NextApiResponse<User>) {
  const { id } = req.query;

  const user = await userService.getUser(id as string);

  if (!user) {
    throw new ApiError(HttpStatusCode.NotFound, "User not found");
  }

  return res.status(200).json(user);
}
