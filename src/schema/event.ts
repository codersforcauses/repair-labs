import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Event name must be 1 or more characters long" }),
    location: z
      .string()
      .min(1, { message: "Event location must be 1 or more characters long" }),
    description: z.string().min(5, {
      message: "Description of the event must be more than 5 characters long."
    }),
    disclaimer: z.string().optional(),
    eventType: z
      .string()
      .min(1, { message: "Event type must be 1 or more characters long" }),
    startDate: z
      .string()
      .datetime({ offset: true, message: "Invalid date format for startDate" }),
    endDate: z
      .string()
      .datetime({ offset: true, message: "Invalid date format for endDate" })
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    // validation to ensure the end date comes after the start date
    message: "End Date must be later than Start Date",
    path: ["endDate"]
  });

export const addEventRepairerSchema = z.object({
  userId: z
    .string()
    .min(1, { message: "UserId must be 1 or more characters long" }),
  id: z
    .string()
    .min(1, { message: "Event ID must be 1 or more characters long" })
});

export const updateEventSchema = z
  .object({
    name: z.string().optional(),
    location: z.string().optional(),
    description: z
      .string()
      .min(5, {
        message: "Description of the event must be more than 5 characters long."
      })
      .optional(),
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
    status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]).optional()
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
