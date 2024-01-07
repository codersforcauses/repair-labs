import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import apiHandler from "@/lib/api-handler";
import userService from "@/services/user";
import { User } from "@/types";

export default apiHandler({
  get: getUser
});

async function getUser(req: NextApiRequest, res: NextApiResponse<User>) {
  const userId = z.string().parse(req.query.id);

  const user = await userService.getUser(userId);

  return res.status(200).json(user);
}
