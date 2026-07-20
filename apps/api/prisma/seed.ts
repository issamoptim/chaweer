import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const BAR_ASSOCIATIONS: Array<{ key: string; name: string }> = [
  { key: 'casablanca', name: 'Barreau de Casablanca' },
  { key: 'rabat', name: 'Barreau de Rabat' },
  { key: 'marrakech', name: 'Barreau de Marrakech' },
  { key: 'fes', name: 'Barreau de Fès' },
  { key: 'tanger', name: 'Barreau de Tanger' },
  { key: 'agadir', name: 'Barreau d\'Agadir' },
  { key: 'meknes', name: 'Barreau de Meknès' },
  { key: 'oujda', name: 'Barreau d\'Oujda' },
  { key: 'kenitra', name: 'Barreau de Kénitra' },
  { key: 'tetouan', name: 'Barreau de Tétouan' },
  { key: 'settat', name: 'Barreau de Settat' },
  { key: 'el-jadida', name: 'Barreau d\'El Jadida' },
];

const CITIES: string[] = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Mohammedia',
];

const LANGUAGES: Array<{ code: string; name: string }> = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

const SPECIALIZATIONS: Array<{
  key: string;
  name: string;
  practiceAreas: Array<{ key: string; name: string }>;
}> = [
  {
    key: 'droit-du-travail',
    name: 'Droit du travail',
    practiceAreas: [
      { key: 'licenciement', name: 'Licenciement' },
      { key: 'litige-salarial', name: 'Litige salarial' },
      { key: 'harcelement-au-travail', name: 'Harcèlement au travail' },
      { key: 'contrat-de-travail', name: 'Contrat de travail' },
      { key: 'rupture-conventionnelle', name: 'Rupture conventionnelle' },
      { key: 'accident-du-travail', name: 'Accident du travail' },
    ],
  },
  {
    key: 'droit-de-la-famille',
    name: 'Droit de la famille',
    practiceAreas: [
      { key: 'divorce', name: 'Divorce' },
      { key: 'garde-denfants', name: "Garde d'enfants" },
      { key: 'pension-alimentaire', name: 'Pension alimentaire' },
      { key: 'succession', name: 'Succession' },
      { key: 'mariage', name: 'Mariage' },
      { key: 'reconnaissance-de-paternite', name: 'Reconnaissance de paternité' },
    ],
  },
  {
    key: 'droit-des-affaires',
    name: 'Droit des affaires',
    practiceAreas: [
      { key: 'creation-dentreprise', name: "Création d'entreprise" },
      { key: 'contrats-commerciaux', name: 'Contrats commerciaux' },
      { key: 'recouvrement-de-creances', name: 'Recouvrement de créances' },
      { key: 'litige-entre-associes', name: 'Litige entre associés' },
    ],
  },
  {
    key: 'droit-immobilier',
    name: 'Droit immobilier',
    practiceAreas: [
      { key: 'achat-immobilier', name: 'Achat immobilier' },
      { key: 'litige-locatif', name: 'Litige locatif' },
      { key: 'copropriete', name: 'Copropriété' },
      { key: 'permis-de-construire', name: 'Permis de construire' },
    ],
  },
  {
    key: 'droit-penal',
    name: 'Droit pénal',
    practiceAreas: [
      { key: 'contravention-amende', name: 'Contravention / amende' },
      { key: 'garde-a-vue', name: 'Garde à vue' },
      { key: 'plainte-penale', name: 'Plainte pénale' },
      { key: 'defense-penale', name: 'Défense pénale' },
    ],
  },
  {
    key: 'droit-des-etrangers',
    name: 'Droit des étrangers',
    practiceAreas: [
      { key: 'titre-de-sejour', name: 'Titre de séjour' },
      { key: 'regroupement-familial', name: 'Regroupement familial' },
      { key: 'naturalisation', name: 'Naturalisation' },
    ],
  },
  {
    key: 'droit-fiscal',
    name: 'Droit fiscal',
    practiceAreas: [
      { key: 'controle-fiscal', name: 'Contrôle fiscal' },
      { key: 'contentieux-fiscal', name: 'Contentieux fiscal' },
      { key: 'optimisation-fiscale', name: 'Optimisation fiscale' },
    ],
  },
  {
    key: 'droit-de-la-consommation',
    name: 'Droit de la consommation',
    practiceAreas: [
      { key: 'litige-avec-un-commercant', name: 'Litige avec un commerçant' },
      { key: 'garantie-produit', name: 'Garantie produit' },
      { key: 'credit-a-la-consommation', name: 'Crédit à la consommation' },
    ],
  },
];

async function main(): Promise<void> {
  for (const [index, item] of BAR_ASSOCIATIONS.entries()) {
    await prisma.barAssociation.upsert({
      where: { key: item.key },
      update: { name: item.name, order: index },
      create: { key: item.key, name: item.name, order: index },
    });
  }

  for (const [index, name] of CITIES.entries()) {
    const key = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    await prisma.city.upsert({
      where: { key },
      update: { name, order: index },
      create: { key, name, order: index },
    });
  }

  for (const [index, item] of LANGUAGES.entries()) {
    await prisma.language.upsert({
      where: { code: item.code },
      update: { name: item.name, order: index },
      create: { code: item.code, name: item.name, order: index },
    });
  }

  for (const [specIndex, spec] of SPECIALIZATIONS.entries()) {
    const specialization = await prisma.specialization.upsert({
      where: { key: spec.key },
      update: { name: spec.name, order: specIndex },
      create: { key: spec.key, name: spec.name, order: specIndex },
    });

    for (const [areaIndex, area] of spec.practiceAreas.entries()) {
      await prisma.practiceArea.upsert({
        where: { key: area.key },
        update: {
          name: area.name,
          order: areaIndex,
          specializationId: specialization.id,
        },
        create: {
          key: area.key,
          name: area.name,
          order: areaIndex,
          specializationId: specialization.id,
        },
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('Referential seed completed.');
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
