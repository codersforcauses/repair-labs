import { RepairStatus } from "@prisma/client";
import { z } from "zod";

import { paginationSchema } from "@/lib/pagination";
import { RepairRequestField } from "@/types";

const stringOrArray = z.union([
  z.literal("").transform(() => undefined),
  z.string().transform((s) => [s]),
  z.array(z.string())
]);

// This is typed to throw a type error if the schema changes
const allowedSortFields: RepairRequestField[] = [
  "status",
  "itemType",
  "itemBrand",
  "requestDate"
] as const;

export const getRepairRequestSchema = paginationSchema.extend({
  id: z.string(),
  sortKey: z
    .string()
    .refine((value) => value in allowedSortFields, {
      message: "Incorrect value for sortKey"
    })
    .optional(),
  sortMethod: z.enum(["asc", "desc"]).optional(),
  searchWord: z.string().optional(),
  itemType: stringOrArray.optional(),
  itemBrand: stringOrArray.optional(),
  assignedTo: stringOrArray.optional()
});

export const createRepairRequestSchema = z.object({
  eventId: z.string().min(1, { message: "Event is required" }),
  description: z.string().min(5, {
    message: "Description of the item must be at least 5 characters long"
  }),
  itemType: z.string().min(1, { message: "Item type is required" }),
  itemBrand: z.string().min(1, { message: "Item brand is required" }),
  thumbnailImage: z.string().optional(), // an optional string that is a URL
  images: z.array(z.any()).optional(),
  comment: z.string().optional()
});

export const updateRepairRequestSchema = z.object({
  itemType: z.string().min(1, { message: "Item name is required" }).optional(),
  itemBrand: z.string().min(1, { message: "Brand is required" }).optional(),
  itemMaterial: z
    .string()
    .min(1, { message: "Material is required" })
    .optional(),
  hoursWorked: z
    .preprocess(
      (input) => {
        const processedInput = z
          .string()
          .trim()
          .regex(/^[-+]?[0-9]+(\.[0-9]{1,2})?$/)
          .transform(Number)
          .safeParse(input);
        return processedInput.success ? processedInput.data : input;
      },
      z
        .number({
          required_error: "Time in hours is required",
          invalid_type_error: "Time in hours must be a number"
        })
        .positive({ message: "Time in hours must be a positive number" })
    )
    .optional(),
  isSparePartsNeeded: z.string().optional(),
  spareParts: z.string().optional(),
  repairComment: z
    .string()
    .min(5, { message: "Job description must be at least 5 characters long." })
    .optional(),
  assignedTo: z.string().optional(),
  repairStatus: z
    .enum([
      RepairStatus.ACCEPTED,
      RepairStatus.CANCELLED,
      RepairStatus.FAILED,
      RepairStatus.PENDING,
      RepairStatus.REJECTED,
      RepairStatus.REPAIRED
    ])
    .optional()
});
