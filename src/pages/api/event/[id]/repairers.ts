import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { HttpStatusCode } from "axios";

import apiHandler from "@/lib/api-handler";
import { addEventRepairerSchema } from "@/schema/event";
import userService from "@/services/user";
import { EventRepairer } from "@/types";

import prisma from "../../../../lib/prisma";

export default apiHandler({
  post: createRepairer
});

async function createRepairer(
  req: NextApiRequest,
  res: NextApiResponse<EventRepairer>
) {
  const { userId, id } = addEventRepairerSchema.parse({
    ...req.body,
    ...req.query
  });

  const event = await prisma.event.findUnique({
    where: { id: id as string }
  });

  if (!event) {
    throw new ApiError(HttpStatusCode.NotFound, "Event not found");
  }

  const user = await userService.getUser(userId as string);

  if (!user) {
    throw new ApiError(HttpStatusCode.NotFound, "User not found");
  }

  const newEventRepairer = await prisma.eventRepairer.create({
    data: {
      userId: userId as string,
      eventId: id as string
    }
  });

  res.status(200).json(newEventRepairer);
}
