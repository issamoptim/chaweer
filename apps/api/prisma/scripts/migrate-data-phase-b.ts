import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function migrateData(): Promise<void> {
  console.log('=== Phase B: Data Migration ===\n');

  // Step 1: Create ProfessionalContact records from existing phone data
  console.log('Step 1: Migrating professionalPhone -> ProfessionalContact...');
  const profilesWithPhone = await prisma.professionalProfile.findMany({
    where: { professionalPhone: { not: null } },
    select: { id: true, professionalPhone: true },
  });

  let contactsCreated = 0;
  for (const profile of profilesWithPhone) {
    const existing = await prisma.professionalContact.findUnique({
      where: { profileId: profile.id },
    });
    if (!existing) {
      await prisma.professionalContact.create({
        data: {
          profileId: profile.id,
          phone: profile.professionalPhone,
        },
      });
      contactsCreated++;
    }
  }
  console.log(
    `  Created ${contactsCreated} ProfessionalContact records (${profilesWithPhone.length} profiles with phone)\n`,
  );

  // Step 2: Create Office records from existing address/city data
  console.log('Step 2: Migrating officeAddress + cityId -> Office...');
  const profilesWithOffice = await prisma.professionalProfile.findMany({
    where: {
      OR: [{ officeAddress: { not: null } }, { cityId: { not: null } }],
    },
    select: { id: true, officeAddress: true, cityId: true },
  });

  let officesCreated = 0;
  for (const profile of profilesWithOffice) {
    const existing = await prisma.office.findUnique({
      where: { profileId: profile.id },
    });
    if (!existing) {
      await prisma.office.create({
        data: {
          profileId: profile.id,
          address: profile.officeAddress,
          cityId: profile.cityId,
        },
      });
      officesCreated++;
    }
  }
  console.log(
    `  Created ${officesCreated} Office records (${profilesWithOffice.length} profiles with office data)\n`,
  );

  // Step 3: Set ConsultationOffer defaults
  console.log('Step 3: Setting ConsultationOffer defaults...');
  const titleUpdated = await prisma.consultationOffer.updateMany({
    where: { title: null },
    data: { title: 'Consultation juridique' },
  });
  console.log(`  Updated title: ${titleUpdated.count} rows`);

  const activeUpdated = await prisma.consultationOffer.updateMany({
    where: { active: null },
    data: { active: true },
  });
  console.log(`  Updated active: ${activeUpdated.count} rows`);

  const orderUpdated = await prisma.consultationOffer.updateMany({
    where: { order: null },
    data: { order: 0 },
  });
  console.log(`  Updated order: ${orderUpdated.count} rows\n`);

  console.log('=== Phase B: Data Migration Complete ===');
}

migrateData()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
