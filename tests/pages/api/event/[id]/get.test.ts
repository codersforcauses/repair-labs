import type { PageConfig } from "next";
import { testApiHandler } from "next-test-api-route-handler";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { cleanup, seedTestData } from "@/../tests/utils";
import endpoint from "@/pages/api/event/[id]";

// Respect the Next.js config object if it's exported
const handler: typeof endpoint & { config?: PageConfig } = endpoint;

describe("GET /api/event/:id", () => {
  beforeAll(async () => {
    await cleanup();
    await seedTestData();
    vi.mock("@clerk/nextjs/server");
    vi.mock("@clerk/nextjs");
  });

  it("should return 404 if an existing event is not found", async () => {
    await testApiHandler({
      handler,
      params: { id: "NON_EXISTENT_ID" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        expect(res.status).toBe(404);
      }
    });
  });

  it("should be able to get an event", async () => {
    await testApiHandler({
      handler,
      params: { id: "acf5ed50-19a2-11ee-be56-0242ac120002" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const result = await res.json();

        const expectedEvent = {
          id: "acf5ed50-19a2-11ee-be56-0242ac120002",
          createdBy: {
            id: "mock user",
            firstName: "test",
            lastName: "test",
            role: "CLIENT",
            emailAddress: "test@gmail.com"
          },
          name: "Laptop Repair Event",
          location: "Curtin University",
          description: "Laptop repair event.",
          eventType: "Laptop",
          disclaimer: "This is a disclaimer",
          startDate: "2023-11-16T01:27:08.417Z",
          endDate: "2023-11-17T01:27:08.417Z",
          status: "UPCOMING"
        };

        expect(res.status).toBe(200);
        expect(result).toMatchObject(expectedEvent);
      }
    });
  });
});
