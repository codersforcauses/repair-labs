import type { NextApiRequest, NextApiResponse } from "next";
import { Staff } from "@prisma/client";

import apiHandler from "@/lib/api-handler";
import prisma from "@/lib/prisma";

export default apiHandler({
  get: getStaff
});

async function getStaff(req: NextApiRequest, res: NextApiResponse<Staff[]>) {
  const data = await prisma.staff.findMany();

  return res.status(200).json(data);
}
