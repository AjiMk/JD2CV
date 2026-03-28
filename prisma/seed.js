const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { countries } = require("./seed-data");

const connectionString = process.env.DATABASE_URL;
const adapter = connectionString
  ? new PrismaPg({ connectionString })
  : undefined;

const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

async function main() {
  for (const countryData of countries) {
    const country = await prisma.country.upsert({
      where: { name: countryData.name },
      update: { code: countryData.code },
      create: {
        name: countryData.name,
        code: countryData.code,
      },
    });

    for (const stateData of countryData.states) {
      await prisma.state.upsert({
        where: {
          countryId_name: {
            countryId: country.id,
            name: stateData.name,
          },
        },
        update: { code: stateData.code },
        create: {
          countryId: country.id,
          name: stateData.name,
          code: stateData.code,
        },
      });
    }
  }

  console.log(`Seeded ${countries.length} countries and their states`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
