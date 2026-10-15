
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash: hashPassword("password"),
    },
  });

  const resources = [
    {
      name: "Meeting Room A",
      type: "Meeting Room",
      location: "First Floor",
      description: "Room for team meetings",
    },
    {
      name: "Projector 01",
      type: "Equipment",
      location: "IT Office",
      description: "Portable presentation projector",
    },
    {
      name: "Laptop 01",
      type: "Equipment",
      location: "IT Office",
      description: "Shared work laptop",
    },
  ];

  for (const item of resources) {
    const existing = await prisma.resource.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      await prisma.resource.create({
        data: {
          ...item,
          status: "ACTIVE",
        },
      });
    }
  }

  console.log("Sample data created.");
  console.log("Demo user:", user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
