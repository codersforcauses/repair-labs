import type { NextApiRequest, NextApiResponse } from "next";

import apiHandler from "@/lib/api-handler";

import prisma from "../../../lib/prisma";

export default apiHandler({ get: getImages });

async function getImages(req: NextApiRequest, res: NextApiResponse) {
  const repairRequestId = req.query.repairRequestId as string;

  const repairRequestImages = await prisma.repairRequestImage.findMany({
    where: { repairRequest: { id: Number(repairRequestId) } }
  });

  return res.status(200).json(repairRequestImages);
}
