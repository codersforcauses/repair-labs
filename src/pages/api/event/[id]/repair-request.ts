import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { HttpStatusCode } from "axios";

import apiHandler from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import repairRequestService from "@/services/repairRequest";
import { RepairRequestResponse } from "@/types";

export default apiHandler({
  get: getRepairRequests
});

async function getRepairRequests(
  req: NextApiRequest,
  res: NextApiResponse<RepairRequestResponse[]>
) {
  const { id } = req.query;

  const event = await prisma.event.findUnique({
    where: { id: id as string }
  });

  if (!event) {
    throw new ApiError(HttpStatusCode.NotFound, "Event not found");
  }

  const repairRequests = await prisma.repairRequest.findMany({
    where: { event: { id: id as string } },
    include: {
      images: true
    }
  });

  // TODO: make a singular version
  const repairRequestResponse =
    await repairRequestService.toClientResponse(repairRequests);

  return res.status(200).json(repairRequestResponse);
}
