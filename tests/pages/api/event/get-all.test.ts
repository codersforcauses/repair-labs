import type { PageConfig } from "next";
import { testApiHandler } from "next-test-api-route-handler";
import { beforeAll, describe, it, vi } from "vitest";

// 
import endpoint from "@/pages/api/event";
import { UserRole } from "@/types";

import { cleanup, seedTestData } from "../../../utils";

// Respect the Next.js config object if it's exported
const handler: typeof endpoint & { config?: PageConfig } = endpoint;
describe("GET /api/event", () => {
  beforeAll(async () => {
    await cleanup();
    await seedTestData();
    vi.mock("@clerk/nextjs/server", () => {
      return {
        getAuth: vi
          .fn()
          .mockReturnValueOnce({ userId: "REPAIRER" })
          .mockReturnValueOnce({ userId: "ADMIN" })
      };
    });
    vi.doMock("@/services/user", () => {
      return {
        getRole: vi
          .fn()
          .mockReturnValueOnce(UserRole.REPAIRER)
          .mockReturnValueOnce(UserRole.ADMIN)
      };
    });
  }, 90000);

  it("should return 1 event for REPAIRER", async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const result = await res.json();
      }
    });
  }, 90000);
  it("should return 2 events for ADMIN", async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const result = await res.json();
      }
    });
  });
});
