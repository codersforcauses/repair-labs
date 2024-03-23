import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import { RepairStatus } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { z } from "zod";

import apiHandler from "@/lib/api-handler";
import { addEventRepairerSchema } from "@/schema/event";
import userService from "@/services/user";
import { User } from "@/types";

import prisma from "../../../../lib/prisma";

export default apiHandler({
  get: getRepairers,
  post: createRepairer
});

interface responseEventRepairer {
  message: string;
}

async function createRepairer(
  req: NextApiRequest,
  res: NextApiResponse<responseEventRepairer>
) {
  const { userId, id } = addEventRepairerSchema.parse({
    ...req.body,
    ...req.query
  });

  const event = await prisma.event.findUnique({
    where: { id: id }
  });

  if (!event) {
    throw new ApiError(HttpStatusCode.NotFound, "Event not found");
  }

  const userMap = await userService.getUsers(userId);

  const filterEmpty = userMap.filter((user) =>
    user && Object.keys(user).length !== 0 ? user : null
  );

  if (filterEmpty.length === 0) {
    throw new ApiError(HttpStatusCode.NotFound, "Users not found / empty");
  }

  const responseEndpoint = await prisma.eventRepairer.createMany({
    data: userId.map((userId) => ({
      userId: userId as string,
      eventId: id as string
    })),
    skipDuplicates: true
  });

  res
    .status(200)
    .json({ message: "Successfully added volunteers to an event" });
}

async function getRepairers(req: NextApiRequest, res: NextApiResponse) {
  const eventId = z.string().parse(req.query.id);
  const result = await getEventRepairers(eventId as string);

  res.status(200).json(result);
}

export type EventRepairer = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  acceptedTasksCount: number;
};

async function getEventRepairers(id: string) {
  // get repairers from table EventRepairer
  const eventRepairer = await prisma.eventRepairer.findMany({
    where: { eventId: id }
  });

  if (eventRepairer.length === 0) {
    return [];
  }

  const userIds = eventRepairer.map((repairer) => repairer.userId);

  // get additional informations like firstName, lastName, email, avatar
  const repairersUsers: Partial<Record<string, User>> =
    await userService.getUserMapFromIds(userIds);

  // Prepare to fetch accepted task counts in parallel
  const countsPromises = userIds.map((userId) =>
    prisma.repairRequest.count({
      where: {
        assignedTo: userId,
        status: RepairStatus.ACCEPTED
      }
    })
  );

  const counts = await Promise.all(countsPromises);

  /* eslint-disable no-console */
  if (Object.keys(repairersUsers).length !== userIds.length) {
    console.error("Mismatch in users from clerk and database");
  }

  return userIds.map((userId, index) => {
    const userData = repairersUsers[userId];

    return {
      userId: userId,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.emailAddress,
      avatar: userData?.imageUrl,
      acceptedTasksCount: counts[index]
    } as EventRepairer;
  });
}
