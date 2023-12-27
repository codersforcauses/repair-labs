import type { NextApiRequest, NextApiResponse } from "next";

import apiHandler from "@/lib/api-handler";
import userService from "@/services/user";
import { ErrorResponse, User } from "@/types";

export default apiHandler({
  get: getUsersFromIds
});

async function getUsersFromIds(
  req: NextApiRequest,
  res: NextApiResponse<User[] | ErrorResponse>
) {
  let { ids } = req.query;
  if (!ids) return res.status(400).json({ message: "No user ids provided" });

  if (!Array.isArray(ids)) ids = ids.split(",");

  const users = await userService.getUserMapFromIds(ids);
  const response = Object.values(users).filter((user): user is User => !!user);

  return res.status(200).json(response);
}
