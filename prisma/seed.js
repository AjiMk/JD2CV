const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { countries, skills } = require("./seed-data");

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

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category },
      create: {
        name: skill.name,
        category: skill.category,
      },
    });
  }

  console.log(
    `Seeded ${countries.length} countries, their states, and ${skills.length} skills`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
