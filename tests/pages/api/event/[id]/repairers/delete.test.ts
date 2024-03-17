import { PageConfig } from "next";
import { testApiHandler } from "next-test-api-route-handler";
import { beforeAll, describe, expect, it, vi } from "vitest";

import endpoint from "@/pages/api/event/[id]/repairers";
import userService from "@/services/user";
import { User } from "@/types";

import prisma from "../../../../../setup";
import { cleanup, seedTestData } from "../../../../../utils";

// Respect the Next.js config object if it's exported
const handler: typeof endpoint & { config?: PageConfig } = endpoint;

describe("DELETE /api/event/[id]/repairers", () => {
  beforeAll(async () => {
    await cleanup();
    await seedTestData();

    await prisma.event.create({
      data: {
        id: "acf5ed50-19a2-11ee-be56-0242ac120004",
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

    await prisma.eventRepairer.createMany({
      data: [
        {
          id: "88676ba2-8d86-49b1-9969-ba3997917575",
          userId: "Mock Repairer",
          eventId: "acf5ed50-19a2-11ee-be56-0242ac120004"
        },
        {
          id: "88676ba2-8d86-49b1-9969-ba3997917576",
          userId: "Jim",
          eventId: "acf5ed50-19a2-11ee-be56-0242ac120004"
        },
        {
          id: "88676ba2-8d86-49b1-9969-ba3997917577",
          userId: "John",
          eventId: "acf5ed50-19a2-11ee-be56-0242ac120004"
        }
      ]
    });

    vi.mock("@clerk/nextjs/server", async () => {
      return {
        getAuth: vi.fn().mockReturnValue({ userId: "Mock Repairer" })
      };
    });

    vi.mock("@clerk/nextjs");
    vi.mock("@/services/user");
  });

  it("should be able to delete a single repairer from an event", async () => {
    vi.mocked(userService.getUsers).mockReturnValue(
      Promise.all([
        {
          id: "Mock Repairer",
          firstName: "Mock",
          lastName: "Repairer",
          emailAddress: "mock@repairer.com",
          role: "EVENT_MANAGER"
        }
      ] as User[])
    );

    await testApiHandler({
      handler,
      params: {
        id: "acf5ed50-19a2-11ee-be56-0242ac120004"
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: ["Mock Repairer"]
          })
        });

        expect(res.status).toBe(200);

        // TODO - Add more assertions after figuring out how to mock getting Clerk Users
      }
    });
  });

  it("should be able to remove multiple repairers from an event", async () => {
    vi.mocked(userService.getUsers).mockReturnValue(
      Promise.all([
        {
          id: "Jim",
          firstName: "Jim",
          lastName: "Doe",
          emailAddress: "jim@email.com",
          role: "REPAIRER"
        },
        {
          id: "John",
          firstName: "John",
          lastName: "Doe",
          emailAddress: "john@email.com",
          role: "REPAIRER"
        }
      ] as User[])
    );

    await testApiHandler({
      handler,
      params: {
        id: "acf5ed50-19a2-11ee-be56-0242ac120004"
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: ["Jim", "John"]
          })
        });

        expect(res.status).toBe(200);
      }
    });
  });

  it("should return 404 if event not found", async () => {
    await testApiHandler({
      handler,
      params: {
        id: "non-existent-id"
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: ["Jim", "John"]
          })
        });

        expect(res.status).toBe(404);
      }
    });
  });

  it("should return 404 if repairer not found", async () => {
    vi.mocked(userService.getUsers).mockReturnValue(Promise.all([] as User[]));
    await testApiHandler({
      handler,
      params: {
        id: "acf5ed50-19a2-11ee-be56-0242ac120004"
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: ["NotExists"]
          })
        });

        expect(res.status).toBe(404);
      }
    });
  });
});
