import type { PageConfig } from "next";
import { testApiHandler } from "next-test-api-route-handler";
import { RepairRequest } from "@prisma/client";
import { beforeAll, describe, expect, it, vi } from "vitest";

import endpoint from "@/pages/api/repair-request/[id]";

import prisma from "../../../../src/lib/prisma";
import { cleanup, seedTestData } from "../../../utils";

// Respect the Next.js config object if it's exported
const handler: typeof endpoint & { config?: PageConfig } = endpoint;

describe("PATCH /api/repair-request/:id", () => {
  beforeAll(async () => {
    await cleanup();
    await seedTestData();
    vi.mock("@clerk/nextjs/server");
    vi.mock("@clerk/nextjs");
  });

  it("should return 400 status code on invalid fields", async () => {
    await testApiHandler({
      handler,
      params: { id: "56005d72-2614-11ee-be56-0242ac120002" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            hoursWorked: "asdfasdf",
            isRepaired: "true",
            isSparePartsNeeded: "true",
            spareParts: "battery",
            repairComment: "sfs"
          })
        });

        expect(res.status).toBe(400);
      }
    });
  });

  it("should return 404 status code for an invalid repair request", async () => {
    await testApiHandler({
      handler,
      params: { id: "1919199" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            item: "Clock",
            itemBrand: "Wonderland",
            itemMaterial: "Plastic",
            hoursWorked: 1.5,
            isRepaired: "true",
            isSparePartsNeeded: "true",
            spareParts: "battery",
            repairComment: "Fixed"
          })
        });

        expect(res.status).toBe(404);
      }
    });
  });

  it("should be able to update a repair request", async () => {
    const id = "1";
    await testApiHandler({
      handler,
      params: { id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            item: "Laptop",
            itemBrand: "Apple",
            itemMaterial: "Metal",
            hoursWorked: 9.9,
            isRepaired: "true",
            isSparePartsNeeded: "true",
            spareParts: "new brain x1",
            repairComment: "nice brain. fixed!"
          })
        });

        expect(res.status).toBe(204);

        const expectedRepairRequest: RepairRequest | null =
          await prisma.repairRequest.findUnique({
            where: {
              id: Number(id)
            }
          });

        expect(expectedRepairRequest?.itemMaterial).equals("Metal");
        expect(expectedRepairRequest?.hoursWorked.toNumber()).equals(9.9);
        expect(expectedRepairRequest?.status).equals("REPAIRED");
        expect(expectedRepairRequest?.spareParts).equals("new brain x1");
        expect(expectedRepairRequest?.repairComment).equals(
          "nice brain. fixed!"
        );
      }
    });
  });
});
