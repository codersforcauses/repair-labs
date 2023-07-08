/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteIdUniqueData() {
  // repairRequestImage(s) created by default user(s)
  await prisma.repairRequestImage.deleteMany({
    where: {
      repairRequest: {
        OR: [
          { createdBy: "Alice" },
          { createdBy: "Charlie" },
          { createdBy: "David" },
          { createdBy: "Greg" },
          { createdBy: "Ivan" },
          { createdBy: "Larry" }
        ]
      }
    }
  });

  // delete repairRequest(s) created by default user(s)
  // possibly linked to default event(s)
  await prisma.repairRequest.deleteMany({
    where: {
      OR: [
        { createdBy: "Alice" },
        { createdBy: "Charlie" },
        { createdBy: "David" },
        { createdBy: "Greg" },
        { createdBy: "Ivan" },
        { createdBy: "Larry" }
      ]
    }
  });
  console.log("Deleted default RepairRequest records.");
}

async function main() {
  deleteIdUniqueData();

  // create default itemType(s)
  const ClockItemType = await prisma.itemType.upsert({
    where: { name: "Clock" },
    create: { name: "Clock" },
    update: {}
  });
  console.log(ClockItemType);

  const BikeItemType = await prisma.itemType.upsert({
    where: { name: "Bike" },
    create: { name: "Bike" },
    update: {}
  });
  console.log(BikeItemType);

  // create default brand(s)
  const WonderlandBrand = await prisma.brand.upsert({
    where: { name: "Wonderland" },
    create: { name: "Wonderland" },
    update: {}
  });
  console.log(WonderlandBrand);

  const OtherBikeBrand = await prisma.brand.upsert({
    where: { name: "OtherBikeBrand" },
    create: { name: "OtherBikeBrand" },
    update: {}
  });
  console.log(OtherBikeBrand);

  const BikeBrand = await prisma.brand.upsert({
    where: { name: "BikeBrand" },
    create: { name: "BikeBrand" },
    update: {}
  });
  console.log(BikeBrand);

  // create default event(s)
  const event1 = await prisma.event.upsert({
    where: { name: "Can Bob Fix It?" },
    create: {
      createdBy: "Bob (The) Builder",
      name: "Can Bob Fix It?",
      location: "Bobsville",
      description:
        "A general contractor from Bobsville provides his services in Bobsville.",
      volunteers: ["Cheshire Cat"],
      event: {
        connect: { name: "Clock" }
      },
      startDate: new Date(2023, 5, 28, 15, 30, 0, 0),
      endDate: new Date(2023, 6, 1, 15, 30, 0, 0)
    },
    update: {}
  });
  console.log({ event1 });

  const event2 = await prisma.event.upsert({
    where: { name: "Evans' Repair Warehouse" },
    create: {
      id: "6b3e0cca-d636-472d-8c6e-1cc63bde6ceb",
      createdBy: "Evans",
      name: "Evans' Repair Warehouse",
      location: "The big warehouse on 5th st",
      description: "Evans fixes bikes & trikes",
      volunteers: ["Fred", "Gerald", "Harold"],
      event: {
        connect: { name: "Bike" }
      },
      startDate: new Date(2023, 8, 12, 15, 30, 0, 0),
      endDate: new Date(2023, 8, 15, 15, 30, 0, 0)
    },
    update: {}
  });
  console.log(event2);

  // create default repairRequest(s)
  const repairRequest1 = await prisma.repairRequest.create({
    data: {
      id: "40e22917-5649-4dca-aae5-c2bb3d20303a",
      createdBy: "Alice",
      assignedTo: "Cheshire Cat",
      event: {
        connect: { id: event1.id }
      },
      status: "PENDING",
      description: "Clock stopped ticking",
      comment: "Clock starts to tick for 3 seconds after it has been shaken.",
      itemBrand: "Wonderland",
      requestDate: new Date(),
      updatedAt: new Date(),
      item: {
        connect: { name: "Clock" }
      },
      thumbnailImage: "https://tinyurl.com/broken-clock-sad",
      images: {
        create: [
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          },
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          }
        ]
      }
    }
  });
  console.log(repairRequest1);

  const repairRequest2 = await prisma.repairRequest.create({
    data: {
      id: "f7dc6714-043a-4a7e-9639-a43d3e5ad2cc",
      createdBy: "Charlie",
      assignedTo: "Cheshire Cat",
      event: {
        connect: { id: event1.id }
      },
      status: "PENDING",
      description: "Clock Shattered",
      comment: "The clock was dropped and glass shattered.",
      requestDate: new Date(),
      updatedAt: new Date(),
      item: {
        connect: { name: "Clock" }
      },
      itemBrand: "Wonderland",
      thumbnailImage: "https://tinyurl.com/broken-clock-sad",
      images: {
        create: [
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          },
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          }
        ]
      }
    }
  });
  console.log(repairRequest2);

  const repairRequest3 = await prisma.repairRequest.create({
    data: {
      id: "3de8cb33-7406-4317-962c-83617095b9b1",
      createdBy: "David",
      assignedTo: "Cheshire Cat",
      event: {
        connect: { id: event1.id }
      },
      status: "PENDING",
      description: "Clock blew up",
      comment: "The clock exploded.",
      requestDate: new Date(),
      updatedAt: new Date(),
      item: {
        connect: { name: "Clock" }
      },
      itemBrand: "Wonderland",
      thumbnailImage: "https://tinyurl.com/broken-clock-sad",
      images: {
        create: [
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          },
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          }
        ]
      }
    }
  });
  console.log(repairRequest3);

  const repairRequest4 = await prisma.repairRequest.create({
    data: {
      id: "42fdbf91-e066-49be-8b60-86439f5c97a5",
      createdBy: "Greg",
      assignedTo: "Fred",
      event: {
        connect: { id: event2.id }
      },
      status: "PENDING",
      description: "My bike chain came out",
      comment: "Pls fix it for me Evan!",
      requestDate: new Date(),
      updatedAt: new Date(),
      item: {
        connect: { name: "Bike" }
      },
      itemBrand: "Wonderland",
      thumbnailImage: "https://tinyurl.com/broken-clock-sad",
      images: {
        create: [
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          },
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          }
        ]
      }
    }
  });
  console.log(repairRequest4);

  const repairRequest5 = await prisma.repairRequest.create({
    data: {
      id: "2e38f35a-7a16-4bd5-bbb9-b511def55ffe",
      createdBy: "Ivan",
      assignedTo: "Gerald",
      event: {
        connect: { id: event2.id }
      },
      status: "PENDING",
      description: "Brake is not working",
      comment: "Please repair my brakes m8.",
      requestDate: new Date(),
      updatedAt: new Date(),
      item: {
        connect: { name: "Bike" }
      },
      itemBrand: "OtherBikeBrand",
      thumbnailImage: "https://tinyurl.com/broken-clock-sad",
      images: {
        create: [
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          },
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          }
        ]
      }
    }
  });
  console.log(repairRequest5);

  const repairRequest6 = await prisma.repairRequest.create({
    data: {
      id: "594ea3f3-4091-438b-8495-0724be3d9060",
      createdBy: "Larry",
      assignedTo: "Harold",
      event: {
        connect: { id: event2.id }
      },
      status: "PENDING",
      description: "Cant adjust seat height",
      comment: "Idk how to adjust seat height",
      requestDate: new Date(),
      updatedAt: new Date(),
      item: {
        connect: { name: "Bike" }
      },
      itemBrand: "BikeBrand",
      thumbnailImage: "https://tinyurl.com/broken-clock-sad",
      images: {
        create: [
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          },
          {
            s3Key: "https://tinyurl.com/broken-clock-sad"
          }
        ]
      }
    }
  });
  console.log(repairRequest6);

  // TODO: Explore generating fake data with faker (Automated Approach)
  // TODO: Add fake data to seed.ts
  // OR, Manually:
  // TODO: Create 1 extra event (At least 2 events)[DONE]
}

main()
  .then(async () => {
    console.log("Database seeding completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
