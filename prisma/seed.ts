/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import {
  Event,
  EventRepairer,
  ItemType,
  PrismaClient,
  RepairRequest
} from "@prisma/client";
const prisma = new PrismaClient();

async function deleteAllData() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}

async function createItemTypes(itemTypeNames: string[]) {
  const itemTypes: ItemType[] = [];

  for (const name of itemTypeNames) {
    const itemType = await prisma.itemType.create({
      data: { name }
    });

    itemTypes.push(itemType);
    console.log(itemType);
  }

  return itemTypes;
}

async function createBrands(brandNames: string[]) {
  const brands: string[] = [];

  for (const name of brandNames) {
    const brand = name;

    brands.push(name);
    console.log(brand);
  }

  return brands;
}

async function createRandomEvents(count: number, itemTypes: ItemType[]) {
  const events: Event[] = [];

  for (let i = 0; i < count; i++) {
    const date = faker.date.future();

    const startDate = new Date(date);
    startDate.setHours(faker.number.int({ min: 8, max: 12 }));

    const endDate = new Date(date);
    endDate.setHours(faker.number.int({ min: 13, max: 17 }));

    const event = await prisma.event.create({
      data: {
        createdBy: faker.person.fullName(),
        name: faker.commerce.productName(),
        location: faker.location.street(),
        description: faker.lorem.sentence(),
        event: {
          connect: { name: faker.helpers.arrayElement(itemTypes).name }
        },
        startDate: startDate,
        endDate: endDate
      }
    });

    events.push(event);
    console.log(event);
  }

  return events;
}

async function createRandomRepairRequests(
  count: number,
  events: Event[],
  itemTypes: ItemType[],
  brands: string[]
) {
  const repairRequests: RepairRequest[] = [];

  for (let i = 0; i < count; i++) {
    const repairRequest = await prisma.repairRequest.create({
      data: {
        createdBy: faker.person.fullName(),
        assignedTo: faker.person.fullName(),
        event: {
          connect: { id: faker.helpers.arrayElement(events).id }
        },
        status: "PENDING",
        description: faker.lorem.sentence(),
        comment: faker.lorem.sentence(),
        itemBrand: faker.helpers.arrayElement(brands),
        itemMaterial: faker.word.noun(),
        requestDate: faker.date.past(),
        updatedAt: faker.date.recent(),
        item: {
          connect: { name: faker.helpers.arrayElement(itemTypes).name }
        },
        thumbnailImage: faker.image.urlPlaceholder({ width: 640, height: 480 }),
        repairComment: faker.lorem.sentence(),
        spareParts: faker.lorem.sentence(),
        images: {
          create: [
            {
              s3Key: faker.image.urlPlaceholder({ width: 640, height: 480 })
            },
            {
              s3Key: faker.image.urlPlaceholder({ width: 640, height: 480 })
            }
          ]
        }
      }
    });

    repairRequests.push(repairRequest);
    console.log(repairRequest);
  }

  return repairRequests;
}

async function createRandomEventRepairers(count: number, events: Event[]) {
  const eventRepairers: EventRepairer[] = [];
  for (let i = 0; i < count; i++) {
    const eventRepairer = await prisma.eventRepairer.create({
      data: {
        userId: faker.person.fullName(),
        eventId: faker.helpers.arrayElement(events).id
      }
    });

    eventRepairers.push(eventRepairer);
  }

  return eventRepairers;
}

async function main() {
  const fakerSeed = 0;
  const itemTypeNames: string[] = ["Clock", "Bike", "Computer"];
  const brandNames: string[] = ["Seiko", "Giant Bicycles", "Alienware"];
  const eventCount = 50;
  const repairRequestCount = 50;
  const repairersCount = 10;

  faker.seed(fakerSeed);
  await deleteAllData();
  const itemTypes: ItemType[] = await createItemTypes(itemTypeNames);
  const brands: string[] = await createBrands(brandNames);
  const events: Event[] = await createRandomEvents(eventCount, itemTypes);
  // const repairRequests: RepairRequest[] =
  await createRandomRepairRequests(
    repairRequestCount,
    events,
    itemTypes,
    brands
  );
  await createRandomEventRepairers(repairersCount, events);
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
