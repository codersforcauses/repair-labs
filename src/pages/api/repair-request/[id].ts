import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { HttpStatusCode } from "axios";
import { z } from "zod";

import apiHandler from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { updateRepairRequestSchema } from "@/schema/repair-request";

export default apiHandler({
  patch: updateRepairRequest,
  get: getRepairRequest
});

async function updateRepairRequest(req: NextApiRequest, res: NextApiResponse) {
  const repairRequestId = z.string().parse(req.query.id);
  const parsedData = updateRepairRequestSchema.parse(req.body);

  const {
    itemMaterial,
    hoursWorked,
    isSparePartsNeeded,
    spareParts,
    repairComment,
    assignedTo,
    repairStatus
  } = parsedData;

  const existingRepairRequest = await prisma.repairRequest.findUnique({
    where: { id: repairRequestId }
  });

  if (!existingRepairRequest) {
    throw new ApiError(
      HttpStatusCode.NotFound,
      "Repair Request does not exist"
    );
  }

  await prisma.repairRequest.update({
    where: { id: repairRequestId },
    data: {
      itemMaterial: itemMaterial,
      hoursWorked: hoursWorked,
      status: repairStatus,
      spareParts:
        isSparePartsNeeded === "true"
          ? spareParts
          : isSparePartsNeeded === "false"
            ? ""
            : undefined,
      repairComment: repairComment,
      assignedTo: assignedTo
    }
  });

  return res.status(204).end();
}

async function getRepairRequest(req: NextApiRequest, res: NextApiResponse) {
  const repairRequestId = z.string().parse(req.query.id);

  const repairRequest = await prisma.repairRequest.findUnique({
    where: { id: repairRequestId }
  });

  if (!repairRequest) {
    throw new ApiError(
      HttpStatusCode.NotFound,
      "Repair Request does not exist"
    );
  }

  return res.status(200).json(repairRequest);
}
