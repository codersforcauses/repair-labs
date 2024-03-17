import type { PageConfig } from "next";
import { testApiHandler } from "next-test-api-route-handler";
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { cleanup, seedTestData } from "@/../tests/utils";
import prisma from "@/lib/prisma";
import endpoint from "@/pages/api/event/[id]/repairers";

const handler: typeof endpoint & { config?: PageConfig } = endpoint;

describe("GET /api/event/:id/repairers", () => {
  beforeAll(async () => {
    await cleanup();
    await seedTestData();

    await prisma.event.create({
      data: {
        id: "acf5ed50-19a2-11ee-be56-0242ac120003",
        createdBy: "Mock Repairer",
        name: "Test Laptop Repair Event",
        location: "Curtin University",
        eventType: "Laptop",
        description: "Test Laptop repair event.",
        disclaimer: "This is a disclaimer",
        startDate: new Date("2024-01-24T01:27:08.417Z"),
        endDate: new Date("2024-01-24T01:27:08.417Z")
      }
    });

    await prisma.eventRepairer.create({
      data: {
        id: "88676ba2-8d86-49b1-9969-ba3997917575",
        userId: "Mock Repairer",
        eventId: "acf5ed50-19a2-11ee-be56-0242ac120003"
      }
    });

    vi.mock("@clerk/nextjs/server", async () => {
      return {
        getAuth: vi.fn().mockReturnValue({ userId: "Mock Repairer" })
      };
    });

    vi.mock("@clerk/nextjs");

    vi.mocked(clerkClient.users.getUserList).mockReturnValue(
      Promise.resolve([
        {
          id: "Mock Repairer",
          firstName: "Mock",
          lastName: "Repairer",
          emailAddresses: [
            {
              emailAddress: "test@gmail.com"
            }
          ],
          publicMetadata: {
            role: "CLIENT"
          }
        }
      ] as unknown as User[])
    );
  });

  it("have matched event, repariers, should be able to return valid ones ", async () => {
    await testApiHandler({
      handler,
      params: { id: "acf5ed50-19a2-11ee-be56-0242ac120003" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const expectedRepairers = [
          {
            id: "Mock Repairer",
            firstName: "Mock",
            lastName: "Repairer",
            emailAddress: "test@gmail.com"
          }
        ];

        const result = await res.json();

        expect(res.status).toBe(200);
        expect(result).toMatchObject(expectedRepairers);
      }
    });
  });

  it("no matched event repairers, should be able to return an empty array ", async () => {
    await testApiHandler({
      handler,
      params: { id: "not-exists" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const result = await res.json();

        expect(res.status).toBe(200);
        expect(result).toMatchObject([]);
      }
    });
  });
});
