// prisma/seed.ts

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Seed data
  const items = [
    {
      name: "Biriyani",
      price: 100,
      ingredients: ["Kayima , lagon-chiken"],
    },
    {
      name: "ChickenFry",
      price: 60,
      ingredients: ["Chicken , Special Masalas"],
    },
    {
      name: "GheeRice",
      price: 40,
      ingredients: ["Jocker"],
    },
    {
      name: "BeefVerattu",
      price: 70,
      ingredients: ["Beef", "Coconu Oil", "Spices"],
    },
  ];

  // Insert data
  await prisma.item.createMany({
    data: items,
    skipDuplicates: true, // Skip items that already exist to avoid errors
  });

  console.log("Seeded the database with initial items");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
