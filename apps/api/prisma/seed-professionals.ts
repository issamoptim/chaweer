import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import https from 'https';
import { PrismaClient, ConsultationModality } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

// Male name indices in FIRST_NAMES (0-based)
const MALE_NAME_INDICES = new Set([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, // first 20
  45, 46, 47, 48, 49, // last 5 (Abdelali, Brahim, Driss, Mustapha, Adil)
]);

function downloadPhoto(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'chaweer-seed/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadPhoto(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadAndSavePhoto(index: number): Promise<string | null> {
  const isMale = MALE_NAME_INDICES.has(index);
  const gender = isMale ? 'men' : 'women';
  const photoId = index % 100;
  const url = `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`;
  return url;
}

// ─── Name pools ───────────────────────────────────────────────
const FIRST_NAMES = [
  'Mohamed', 'Ahmed', 'Youssef', 'Hamza', 'Omar', 'Khalid', 'Said', 'Rachid',
  'Karim', 'Tariq', 'Hassan', 'Mehdi', 'Anas', 'Bilal', 'Reda', 'Yassine',
  'Amine', 'Nabil', 'Fouad', 'Jamal', 'Fatima', 'Khadija', 'Aicha', 'Nadia',
  'Sana', 'Imane', 'Salma', 'Hanane', 'Meryem', 'Zineb', 'Sara', 'Houda',
  'Leila', 'Najat', 'Rachida', 'Wahiba', 'Bouchra', 'Asmaa', 'Ghita', 'Oumaima',
  'Hajar', 'Nawal', 'Soukaina', 'Dounia', 'Latifa', 'Abdelali', 'Brahim',
  'Driss', 'Mustapha', 'Adil',
];

const LAST_NAMES = [
  'Alaoui', 'Benani', 'Bennani', 'El Fassi', 'El Idrissi', 'El Amrani', 'Tazi',
  'Benjelloun', 'Berrada', 'Sqalli', 'Kabbaj', 'Chraibi', 'Bennis', 'El Ghazali',
  'Sefrioui', 'Belmahi', 'Ouazzani', 'Tahiri', 'El Khattabi', 'Drissi', 'Lahlou',
  'Sebti', 'El Malki', 'Benkirane', 'Chami', 'El Hassani', 'Idrissi', 'Kettani',
  'El Otmani', 'Benslimane', 'El Andaloussi', 'Ramdani', 'El Bouanani', 'Daoudi',
  'El Merini', 'Belkadi', 'Cherkaoui', 'El Mernissi', 'Benabdellah', 'Fahim',
  'Ziani', 'El Kettani', 'Benhima', 'Slaoui', 'El Bakkali', 'Mounib', 'Zerouali',
  'Benmoussa', 'El Bouhssini', 'Hilali',
];

const PROFESSIONAL_TITLES = [
  'Avocat à la Cour', 'Avocate à la Cour', 'Avocat associé', 'Avocate associée',
  'Avocat counsel', 'Avocate counsel', 'Avocat fondé de pouvoir', 'Avocate fondée de pouvoir',
];

const OFFER_TITLES = [
  'Consultation juridique', 'Consultation spécialisée', 'Rendez-vous conseil',
  'Analyse de dossier', 'Consultation approfondie', 'Première consultation juridique',
  'Évaluation de votre dossier', 'Conseil juridique personnalisé',
];

const OFFER_DESCRIPTIONS = [
  'Consultation complète pour évaluer votre situation juridique et définir la meilleure stratégie. Analyse approfondie de vos documents et conseils pratiques pour vos démarches.',
  'Rendez-vous d\'évaluation de votre dossier avec analyse détaillée de vos options légales. Je vous propose un plan d\'action clair et adapté à votre situation personnelle.',
  'Consultation approfondie portant sur l\'examen de votre affaire, l\'identification des enjeux juridiques et la formulation de recommandations stratégiques pour la suite.',
  'Bilan juridique complet avec étude de votre cas, identification des risques et opportunités, et élaboration d\'une stratégie de défense ou de négociation adaptée.',
  'Entretien juridique détaillé permettant d\'évaluer la viabilité de votre demande, les délais à prévoir et les coûts associés à la procédure envisagée.',
  'Consultation stratégique avec revue de vos documents, évaluation des chances de succès et recommandations sur les démarches prioritaires à entreprendre.',
  'Séance de travail approfondie pour faire le point sur votre situation, analyser les aspects légaux et vous orienter vers la solution la plus appropriée.',
  'Consultation d\'évaluation avec diagnostic juridique, analyse des preuves disponibles et plan d\'action personnalisé pour défendre vos intérêts.',
];

const DEGREES = [
  'Master en Droit Privé', 'Master en Droit des Affaires', 'Master en Droit Public',
  'Licence en Droit', 'DEA en Droit Civil', 'Doctorat en Droit', 'Master en Droit Pénal',
  'Master en Droit Social', 'DEA en Sciences Juridiques', 'Master en Droit International',
];

const INSTITUTIONS = [
  'Université Mohammed V - Rabat', 'Université Hassan II - Casablanca',
  'Université Cadi Ayyad - Marrakech', 'Université Sidi Mohammed Ben Abdellah - Fès',
  'Université Abdelmalek Essaâdi - Tanger', 'Université Ibn Zohr - Agadir',
  'Université Moulay Ismail - Meknès', 'Université Mohammed Premier - Oujda',
  'Université Ibn Tofail - Kénitra', 'Université Abdelmalek Essaâdi - Tétouan',
];

const EXPERIENCE_POSITIONS = [
  'Avocat associé', 'Avocat counsel', 'Juriste d\'entreprise', 'Avocat collaborateur',
  'Avocat stagiaire', 'Avocat fondé de pouvoir', 'Consultant juridique', 'Avocat senior',
];

const EXPERIENCE_ORGS = [
  'Cabinet Alaoui & Associés', 'Étude Benani Juridique', 'Cabinet El Fassi & Partners',
  'Étude Tazi Avocats', 'Cabinet Berrada & Co', 'Cabinet Kabbaj Legal',
  'Étude Chraibi Avocats', 'Cabinet El Malki Associés', 'Cabinet Benkirane Law Firm',
  'Cabinet El Hassani & Associés', 'Cabinet Lahlou Avocats', 'Étude Sebti Legal',
];

const CERTIFICATION_TITLES = [
  'Certificat en Médiation Judiciaire', 'Certificat en Arbitrage International',
  'Certificat en Droit Immobilier', 'Diplôme en Contentieux Fiscal',
  'Certificat en Compliance & Conformité', 'Certificat en Propriété Intellectuelle',
];

const CERTIFICATION_ISSUERS = [
  'Institut de Formation Judiciaire', 'Centre d\'Arbitrage de la CCIS',
  'Ordre des Avocats du Maroc', 'Académie Marocaine des Études Juridiques',
  'Institut National de Médiation',
];

const MEMBERSHIP_ORGS = [
  'Association des Avocats du Maroc', 'Club des Juristes d\'Affaires',
  'Association Marocaine du Droit de la Famille', 'Société Marocaine de Droit Fiscal',
  'Réseau des Avocats Médiateurs', 'Association du Droit Immobilier Marocain',
];

const MEMBERSHIP_ROLES = ['Membre actif', 'Membre du bureau', 'Trésorier', 'Secrétaire général', 'Vice-président'];

const OFFICE_NAMES = [
  'Cabinet', 'Étude juridique', 'Office', 'Cabinet d\'avocats', 'Étude',
];

const OFFICE_STREETS = [
  'Boulevard Mohammed V', 'Avenue Hassan II', 'Rue de la Liberté', 'Boulevard Zerktouni',
  'Avenue des FAR', 'Rue Ibn Sina', 'Boulevard Anfa', 'Avenue Mohammed VI',
  'Rue Tarik Ibn Ziad', 'Boulevard Al Massira', 'Avenue Al Araar', 'Rue Al Qods',
  'Boulevard Ghandi', 'Avenue de France', 'Rue Ibn Khaldoun', 'Boulevard Al Wahda',
  'Avenue Al Majd', 'Rue Al Adarissa', 'Boulevard Al Qods', 'Avenue Al Hourriya',
];

const ALL_MODALITIES: ConsultationModality[] = ['VIDEO', 'AUDIO', 'CHAT'];

// ─── Helpers ──────────────────────────────────────────────────
function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function pickN<T>(arr: T[], count: number, seed: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[(seed + i * 7) % arr.length]);
  }
  return result;
}

function generateBio(index: number): string {
  const specializations = [
    'droit du travail', 'droit de la famille', 'droit pénal', 'droit des affaires',
    'droit immobilier', 'droit fiscal', 'droit administratif', 'droit de la consommation',
  ];
  const spec = pick(specializations, index);
  const yearsExp = 3 + (index % 25);
  const city = pick(
    ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'],
    index,
  );

  const intros = [
    `Avocat inscrit au barreau depuis plus de ${yearsExp} ans, je consacre ma pratique au ${spec}. J'accompagne mes clients dans la résolution de leurs litiges avec rigueur et engagement. Mon approche combine une analyse juridique approfondie et une écoute attentive pour proposer des solutions pragmatiques et adaptées.`,
    `Fort de ${yearsExp} années d'expérience en ${spec}, j'assiste les particuliers et les entreprises dans la défense de leurs droits. Mon cabinet, situé à ${city}, se distingue par sa réactivité et son souci constant d'obtenir les meilleurs résultats pour chaque client. Je m'engage à fournir un conseil juridique de qualité et un suivi personnalisé.`,
    `Exerçant la profession d'avocat à ${city} depuis ${yearsExp} ans, j'ai développé une expertise reconnue en matière de ${spec}. J'accompagne mes clients à chaque étape de leur parcours juridique, de la consultation initiale à la représentation devant les juridictions. Ma priorité est de rendre le droit accessible et compréhensible pour tous.`,
    `Passionné par le ${spec}, je mets mes ${yearsExp} années d'expérience au service de mes clients à ${city}. Mon cabinet offre un accompagnement sur mesure, fondé sur une connaissance approfondie du cadre légal marocain et une pratique régulière devant les tribunaux. Je m'engage à défendre vos intérêts avec professionnalisme et détermination.`,
  ];

  return pick(intros, index);
}

function generateRegistrationNumber(index: number): string {
  const cityCodes = ['CAS', 'RAB', 'MAR', 'FES', 'TAN', 'AGA', 'MEK', 'OUJ', 'KEN', 'TET', 'SET', 'ELJ'];
  const code = pick(cityCodes, index);
  const num = 1000 + index * 37;
  return `${code}-${String(num).padStart(5, '0')}/${2010 + (index % 15)}`;
}

function generatePhone(index: number): string {
  const prefixes = ['+212 522', '+212 537', '+212 524', '+212 535', '+212 539', '+212 661', '+212 662', '+212 663'];
  const prefix = pick(prefixes, index);
  const num = 100000 + index * 137;
  return `${prefix} ${String(num).padStart(6, '0')}`;
}

function generateCoordinates(index: number): { lat: number; lng: number } {
  const cityCoords: Array<{ lat: number; lng: number }> = [
    { lat: 33.5731, lng: -7.5898 }, // Casablanca
    { lat: 34.0209, lng: -6.8416 }, // Rabat
    { lat: 31.6295, lng: -7.9811 }, // Marrakech
    { lat: 34.0181, lng: -5.0078 }, // Fès
    { lat: 35.7595, lng: -5.8340 }, // Tanger
    { lat: 30.4278, lng: -9.5981 }, // Agadir
    { lat: 33.8935, lng: -5.5473 }, // Meknès
    { lat: 34.6814, lng: -1.9086 }, // Oujda
    { lat: 34.2610, lng: -6.5802 }, // Kénitra
    { lat: 35.5785, lng: -5.3684 }, // Tétouan
    { lat: 33.0010, lng: -7.6166 }, // Salé
    { lat: 33.6833, lng: -7.3833 }, // Mohammedia
  ];
  const base = pick(cityCoords, index);
  const latOffset = ((index * 13) % 100) / 10000;
  const lngOffset = ((index * 17) % 100) / 10000;
  return {
    lat: base.lat + latOffset,
    lng: base.lng + lngOffset,
  };
}

// ─── Main ─────────────────────────────────────────────────────
async function main(): Promise<void> {
  // Fetch all referential data
  const barAssociations = await prisma.barAssociation.findMany({ orderBy: { order: 'asc' } });
  const cities = await prisma.city.findMany({ orderBy: { order: 'asc' } });
  const languages = await prisma.language.findMany({ orderBy: { order: 'asc' } });
  const specializations = await prisma.specialization.findMany({
    include: { practiceAreas: true },
    orderBy: { order: 'asc' },
  });

  if (barAssociations.length === 0 || cities.length === 0 || specializations.length === 0) {
    throw new Error('Referential data missing. Run prisma:seed first.');
  }

  // Clean up previously seeded professionals
  const oldUsers = await prisma.user.findMany({
    where: { email: { contains: '@avocat-seed.chaweer.test' } },
    select: { id: true },
  });
  if (oldUsers.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: oldUsers.map((u) => u.id) } },
    });
    // eslint-disable-next-line no-console
    console.log(`Cleaned up ${oldUsers.length} previously seeded professionals.`);
  }

  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i * 3 + 1);
    const email = `avocat-seed.${String(i + 1).padStart(2, '0')}@avocat-seed.chaweer.test`;
    const barAssociation = pick(barAssociations, i);
    const city = pick(cities, i);
    const coords = generateCoordinates(i);
    const yearsExp = 3 + (i % 25);
    const professionalTitle = pick(PROFESSIONAL_TITLES, i);
    const bio = generateBio(i);
    const registrationNumber = generateRegistrationNumber(i);

    // Pick 1-2 specializations
    const specCount = 1 + (i % 2);
    const selectedSpecs = pickN(specializations, specCount, i);

    // Pick 2-3 languages
    const langCount = 2 + (i % 2);
    const selectedLanguages = pickN(languages, langCount, i);

    // Pick practice areas from selected specs
    const selectedPracticeAreas: string[] = [];
    for (const spec of selectedSpecs) {
      const areaCount = 1 + (i % Math.min(3, spec.practiceAreas.length));
      const areas = pickN(spec.practiceAreas, areaCount, i + spec.id.length);
      selectedPracticeAreas.push(...areas.map((a) => a.id));
    }

    // Offer details
    const offerTitle = pick(OFFER_TITLES, i);
    const offerDescription = pick(OFFER_DESCRIPTIONS, i);
    const offerPrice = 200 + (i % 12) * 50; // 200-750 MAD
    const offerDuration = 30 + (i % 3) * 15; // 30, 45, or 60 min
    const offerModalities = pickN(ALL_MODALITIES, 1 + (i % 3), i) as ConsultationModality[];

    // Contact details
    const phone = generatePhone(i);
    const whatsapp = i % 3 === 0 ? phone : null;
    const publicEmail = `contact.${String(i + 1).padStart(2, '0')}@cabinet-avocat.ma`;
    const website = i % 4 === 0 ? `https://www.cabinet-avocat-${i + 1}.ma` : null;
    const linkedInUrl = i % 5 === 0 ? `https://ma.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}` : null;

    // Office details
    const officeName = `${pick(OFFICE_NAMES, i)} ${lastName}`;
    const officeAddress = `${pick(OFFICE_STREETS, i)}, ${city.name}`;

    // Education (1-2 entries)
    const eduCount = 1 + (i % 2);

    // Experience (1-2 entries)
    const expCount = 1 + (i % 2);

    // Certification (0-1, ~50% have one)
    const hasCert = i % 2 === 0;

    // Membership (0-1, ~50% have one)
    const hasMembership = i % 2 === 1;

    // Download a real portrait photo
    // eslint-disable-next-line no-console
    console.log(`  [${i + 1}/50] Downloading photo for ${firstName} ${lastName}…`);
    const photoUrl = await downloadAndSavePhoto(i);

    // Create everything in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: '$argon2id$seed$placeholder$not$for$login',
          firstName,
          lastName,
          authProvider: 'LOCAL',
          role: 'PROFESSIONAL',
          status: 'ACTIVE',
        },
      });

      // 2. Create professional profile (PUBLISHED)
      const profile = await tx.professionalProfile.create({
        data: {
          userId: user.id,
          status: 'PUBLISHED',
          publishedAt: now,
          professionalTitle,
          registrationNumber,
          yearsOfExperience: yearsExp,
          bio,
          photoUrl,
          barAssociationId: barAssociation.id,
          cityId: city.id,
        },
      });

      // 3. Create specializations
      await tx.professionalSpecialization.createMany({
        data: selectedSpecs.map((spec) => ({
          profileId: profile.id,
          specializationId: spec.id,
        })),
      });

      // 4. Create practice areas
      await tx.professionalPracticeArea.createMany({
        data: [...new Set(selectedPracticeAreas)].map((areaId) => ({
          profileId: profile.id,
          practiceAreaId: areaId,
        })),
      });

      // 5. Create languages
      await tx.professionalLanguage.createMany({
        data: selectedLanguages.map((lang) => ({
          profileId: profile.id,
          languageId: lang.id,
        })),
      });

      // 6. Create consultation offer
      await tx.consultationOffer.create({
        data: {
          profileId: profile.id,
          title: offerTitle,
          description: offerDescription,
          price: offerPrice,
          currency: 'MAD',
          durationMinutes: offerDuration,
          modalities: offerModalities,
          active: true,
          order: 0,
        },
      });

      // 7. Create contact
      await tx.professionalContact.create({
        data: {
          profileId: profile.id,
          phone,
          whatsapp,
          publicEmail,
          website,
          linkedInUrl,
        },
      });

      // 8. Create office
      await tx.office.create({
        data: {
          profileId: profile.id,
          name: officeName,
          address: officeAddress,
          cityId: city.id,
          latitude: coords.lat,
          longitude: coords.lng,
        },
      });

      // 9. Create education
      for (let e = 0; e < eduCount; e++) {
        const startYear = 2005 + (i % 10) + e * 2;
        await tx.education.create({
          data: {
            profileId: profile.id,
            degree: pick(DEGREES, i + e),
            institution: pick(INSTITUTIONS, i + e),
            startYear,
            endYear: startYear + 2,
            order: e,
          },
        });
      }

      // 10. Create experience
      for (let e = 0; e < expCount; e++) {
        const startYear = 2010 + (i % 8) + e * 3;
        const isCurrent = e === expCount - 1;
        await tx.professionalExperience.create({
          data: {
            profileId: profile.id,
            position: pick(EXPERIENCE_POSITIONS, i + e),
            organization: pick(EXPERIENCE_ORGS, i + e),
            startYear,
            endYear: isCurrent ? null : startYear + 4,
            current: isCurrent,
            order: e,
          },
        });
      }

      // 11. Create certification (optional)
      if (hasCert) {
        await tx.certification.create({
          data: {
            profileId: profile.id,
            title: pick(CERTIFICATION_TITLES, i),
            issuer: pick(CERTIFICATION_ISSUERS, i),
            order: 0,
          },
        });
      }
    });

    // eslint-disable-next-line no-console
    console.log(`  [${i + 1}/50] ${firstName} ${lastName} — ${city.name} — ${professionalTitle}`);
  }

  // eslint-disable-next-line no-console
  console.log('\n50 avocats publiés ont été créés avec succès.');
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
