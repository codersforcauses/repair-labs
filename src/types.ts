import {
  $Enums,
  Event as PrismaEvent,
  RepairRequest as PrismaRepairRequest
} from "@prisma/client";
import { z } from "zod";

import { createEventSchema, updateEventSchema } from "@/schema/event";
import {
  createRepairRequestSchema,
  updateRepairRequestSchema
} from "@/schema/repair-request";

// TODO: Not sure if we should be exposing prisma model types in the frontend??

// Repair Requests
export type RepairRequest = PrismaRepairRequest;
export type RepairStatus = $Enums.RepairStatus;
export type CreateRepairRequest = z.infer<typeof createRepairRequestSchema>;
export type GeneralRepairAttempt = z.infer<typeof updateRepairRequestSchema>;

// Events
export type Event = PrismaEvent;
export type EventStatus = $Enums.EventStatus;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;

export type Option = { id: number | string; text: string };

export interface EmailAddress {
  id: string;
  emailAddress: string;
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string;
  role: UserRole;
}

export enum SearchCriteria {
  FirstName = "firstName",
  LastName = "lastName",
  Email = "email",
  Role = "role",
  All = "all"
}

export enum UserRole {
  ADMIN = "ADMIN",
  ORGANISATION_MANAGER = "ORGANISATION_MANAGER",
  EVENT_MANAGER = "EVENT_MANAGER",
  REPAIRER = "REPAIRER",
  CLIENT = "CLIENT"
}

export type NavPath = {
  item: string;
  path: string;
};

// API Responses on client
// All dates are returned as ISO strings
export type EventResponse = {
  id: string;
  createdBy: User;
  /** ISO date string */
  createdAt: string;
  /** ISO date string */
  updatedAt: string;
  name: string;
  location: string;
  description: string;
  eventType: string;
  disclaimer: string;
  status: EventStatus;
  /** ISO date string */
  startDate: string;
  /** ISO date string */
  endDate: string;
};

export type RepairRequestResponse = {
  id: string;
  createdBy: User;
  assignedTo: User;
  eventId: string;
  status: RepairStatus;
  description: string;
  comment: string;
  thumbnailImage?: string;
  repairComment: string;
  spareParts: string;
  hoursWorked: number;
  /** ISO date string */
  requestDate: string;
  /** ISO date string */
  updatedAt: string;
  itemType: string;
  itemBrand: string;
  itemMaterial: string;
  images: string[];
};
