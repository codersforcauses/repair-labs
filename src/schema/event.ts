import { EventStatus } from "@prisma/client";
import { z } from "zod";

import { paginationSchema } from "@/lib/pagination";
import prisma from "@/lib/prisma";

const eventStatusSchema = z.union([
  z.literal("").transform(() => [] as EventStatus[]),
  z.nativeEnum(EventStatus).transform((s) => [s]),
  z.array(z.nativeEnum(EventStatus))
]);

const stringOrArray = z.union([
  z.literal("").transform(() => [] as string[]),
  z.string().transform((s) => [s]),
  z.array(z.string())
]);

export const getEventSchema = z
  .object({
    sortKey: z
      .string()
      .refine((value) => value in prisma.event.fields, {
        message: "Incorrect value for sortKey"
      })
      .optional(),
    sortMethod: z.enum(["asc", "desc"]).optional(),
    searchWord: z.string().optional(),
    minDate: z.coerce.date().optional(),
    maxDate: z.coerce.date().optional(),
    eventType: stringOrArray.optional(),
    eventStatus: eventStatusSchema.optional(),
    createdBy: stringOrArray.optional()
  })
  .merge(paginationSchema);

export const createEventSchema = z
  .object({
    name: z.string({ required_error: "Event name is required" }),
    location: z.string({ required_error: "Event location is required" }),
    description: z
      .string({ required_error: "Description of the event is required" })
      .min(5, {
        message: "Description of the event must be more than 5 characters long."
      }),
    disclaimer: z.string().optional(),
    eventType: z.string({ required_error: "Event type is required" }),
    startDate: z
      .string({ required_error: "startDate is required" })
      .datetime({ offset: true, message: "Invalid date format for startDate" }),
    endDate: z
      .string({ required_error: "endDate is required" })
      .datetime({ offset: true, message: "Invalid date format for endDate" })
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    // validation to ensure the end date comes after the start date
    message: "End Date must be later than Start Date",
    path: ["endDate"]
  });

export const modifyEventRepairerSchema = z.object({
  userId: z.array(z.string({ required_error: "User ID is required" })),
  id: z.string({ required_error: "Event ID is required" })
});

export const updateEventSchema = z
  .object({
    name: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    disclaimer: z.string().optional(),
    eventType: z.string().optional(),
    startDate: z
      .string()
      .datetime({ offset: true, message: "Invalid date format for startDate" })
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true, message: "Invalid date format for endDate" })
      .optional(),
    status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]).optional(),
    thumbnailImage: z.string().optional(), // an optional string that is a URL
    images: z.array(z.any()).optional()
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        // validation to ensure the end date comes after the start date
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End Date must be later than Start Date",
      path: ["endDate"]
    }
  );
