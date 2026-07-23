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
  { code: 'de', name: 'Deutsch' },
  { code: 'ber', name: 'Tamazight' },
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
    key: 'droit-des-affaires-commercial',
    name: 'Droit des affaires / commercial',
    practiceAreas: [
      { key: 'creation-dentreprise', name: "Création d'entreprise" },
      { key: 'fusions-et-acquisitions', name: 'Fusions et acquisitions' },
      { key: 'contrats-commerciaux', name: 'Contrats commerciaux' },
      { key: 'litiges-commerciaux', name: 'Litiges commerciaux' },
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
    key: 'droit-fiscal',
    name: 'Droit fiscal',
    practiceAreas: [
      { key: 'controle-fiscal', name: 'Contrôle fiscal' },
      { key: 'contentieux-fiscal', name: 'Contentieux fiscal' },
      { key: 'fiscalite-des-particuliers', name: 'Fiscalité des particuliers' },
      { key: 'fiscalite-des-entreprises', name: 'Fiscalité des entreprises' },
      { key: 'redressement-fiscal', name: 'Redressement fiscal' },
    ],
  },
  {
    key: 'droit-administratif',
    name: 'Droit administratif',
    practiceAreas: [
      { key: 'recours-administratif', name: 'Recours administratif' },
      { key: 'litige-avec-ladministration', name: 'Litige avec l\'administration' },
      { key: 'marche-public', name: 'Marché public' },
      { key: 'expropriation', name: 'Expropriation' },
    ],
  },
  {
    key: 'droit-de-la-consommation',
    name: 'Droit de la consommation',
    practiceAreas: [
      { key: 'litige-avec-un-vendeur', name: 'Litige avec un vendeur' },
      { key: 'credit-a-la-consommation', name: 'Crédit à la consommation' },
      { key: 'vices-caches', name: 'Vices cachés' },
      { key: 'demarchage-et-vente-a-distance', name: 'Démarchage et vente à distance' },
      { key: 'litiges-e-commerce', name: 'Litiges e-commerce' },
    ],
  },
  {
    key: 'droit-des-etrangers-immigration',
    name: 'Droit des étrangers / immigration',
    practiceAreas: [
      { key: 'titre-de-sejour', name: 'Titre de séjour' },
      { key: 'naturalisation', name: 'Naturalisation' },
      { key: 'regroupement-familial', name: 'Regroupement familial' },
      { key: 'reconduite-a-la-frontiere', name: 'Reconduite à la frontière' },
    ],
  },
  {
    key: 'droit-de-la-sante',
    name: 'Droit de la santé',
    practiceAreas: [
      { key: 'erreur-medicale', name: 'Erreur médicale' },
      { key: 'litige-avec-etablissement-de-sante', name: 'Litige avec un établissement de santé' },
      { key: 'droits-des-patients', name: 'Droits des patients' },
      { key: 'responsabilite-professionnels-de-sante', name: 'Responsabilité des professionnels de santé' },
    ],
  },
  {
    key: 'propriete-intellectuelle',
    name: 'Propriété intellectuelle',
    practiceAreas: [
      { key: 'depot-de-marque', name: 'Dépôt de marque' },
      { key: 'contrefacon', name: 'Contrefaçon' },
      { key: 'droits-dauteur', name: "Droits d'auteur" },
      { key: 'litige-de-brevet', name: 'Litige de brevet' },
    ],
  },
  {
    key: 'droit-des-assurances',
    name: 'Droit des assurances',
    practiceAreas: [
      { key: 'litige-avec-un-assureur', name: 'Litige avec un assureur' },
      { key: 'refus-dindemnisation', name: "Refus d'indemnisation" },
      { key: 'assurance-auto', name: 'Assurance auto' },
      { key: 'assurance-habitation', name: 'Assurance habitation' },
    ],
  },
  {
    key: 'droit-routier',
    name: 'Droit routier',
    practiceAreas: [
      { key: 'contravention-routiere', name: 'Contravention routière' },
      { key: 'permis-de-conduire', name: 'Permis de conduire' },
      { key: 'accident-de-la-route', name: 'Accident de la route' },
      { key: 'retrait-de-points', name: 'Retrait de points' },
    ],
  },
  {
    key: 'droit-des-societes',
    name: 'Droit des sociétés',
    practiceAreas: [
      { key: 'creation-de-societe', name: 'Création de société' },
      { key: 'statuts-et-gouvernance', name: 'Statuts et gouvernance' },
      { key: 'cession-de-parts', name: 'Cession de parts' },
      { key: 'dissolution', name: 'Dissolution' },
    ],
  },
  {
    key: 'droit-bancaire-et-financier',
    name: 'Droit bancaire et financier',
    practiceAreas: [
      { key: 'litige-bancaire', name: 'Litige bancaire' },
      { key: 'credit-immobilier', name: 'Crédit immobilier' },
      { key: 'surendettement', name: 'Surendettement' },
      { key: 'fraude-bancaire', name: 'Fraude bancaire' },
    ],
  },
  {
    key: 'droit-du-numerique-et-donnees-personnelles',
    name: 'Droit du numérique et des données personnelles',
    practiceAreas: [
      { key: 'protection-des-donnees-personnelles', name: 'Protection des données personnelles' },
      { key: 'cybersecurite', name: 'Cybersécurité' },
      { key: 'e-reputation', name: 'E-réputation' },
      { key: 'contrats-informatiques', name: 'Contrats informatiques' },
    ],
  },
  {
    key: 'droit-de-lenvironnement',
    name: "Droit de l'environnement",
    practiceAreas: [
      { key: 'pollution-et-nuisances', name: 'Pollution et nuisances' },
      { key: 'non-respect-des-normes-environnementales', name: 'Non-respect des normes environnementales' },
      { key: 'permis-environnemental', name: 'Permis environnemental' },
    ],
  },
  {
    key: 'droit-des-transports',
    name: 'Droit des transports',
    practiceAreas: [
      { key: 'litige-avec-un-transporteur', name: 'Litige avec un transporteur' },
      { key: 'retard-ou-annulation', name: 'Retard ou annulation' },
      { key: 'marchandises-endommagees', name: 'Marchandises endommagées' },
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

  // Clean up old practice areas and specializations not in the seed data
  const validSpecKeys = SPECIALIZATIONS.map((s) => s.key);
  const validAreaKeys = SPECIALIZATIONS.flatMap((s) => s.practiceAreas.map((a) => a.key));

  await prisma.practiceArea.deleteMany({
    where: { key: { notIn: validAreaKeys } },
  });
  await prisma.specialization.deleteMany({
    where: { key: { notIn: validSpecKeys } },
  });

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
