import type { PageConfig } from "next";
import { testApiHandler } from "next-test-api-route-handler";
import { beforeAll, describe, expect, it, vi } from "vitest";

import endpoint from "@/pages/api/event/[id]/repairers";

import { cleanup, seedTestData } from "../../../../../utils";

// Respect the Next.js config object if it's exported
const handler: typeof endpoint & { config?: PageConfig } = endpoint;

describe("POST /api/event/[id]/repairers", () => {
  beforeAll(async () => {
    await cleanup();
    await seedTestData();

    vi.mock("@clerk/nextjs");
    vi.mock("@clerk/nextjs/server");
  });

  it("should be able to create an event repairer", async () => {
    await testApiHandler({
      handler,
      params: { id: "acf5ed50-19a2-11ee-be56-0242ac120002" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: "Test"
          })
        });

        expect(res.status).toBe(200);
      }
    });
  });

  it("should be able to catch an API error: can't find the event", async () => {
    await testApiHandler({
      handler,
      params: { id: "acf5ed50-19a2-11ee-be56-0242ac122222" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: "Test"
          })
        });

        expect(res.status).toBe(404);
      }
    });
  });

  it("should be able to catch an API error: can't find the repairer", async () => {
    await testApiHandler({
      handler,
      params: { id: "acf5ed50-19a2-11ee-be56-0242ac120002" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: "Feifan"
          })
        });

        expect(res.status).toBe(404);
      }
    });
  });
});
