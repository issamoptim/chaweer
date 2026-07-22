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
    key: 'droit-penal',
    name: 'Droit pénal',
    practiceAreas: [
      { key: 'garde-a-vue-audition-libre', name: 'Garde à vue / audition libre' },
      { key: 'plainte-penale', name: 'Plainte pénale' },
      { key: 'defense-penale', name: 'Défense pénale' },
      { key: 'violences-et-agressions', name: 'Violences et agressions' },
      { key: 'vol-escroquerie-abus-de-confiance', name: 'Vol / escroquerie / abus de confiance' },
      { key: 'infractions-routieres-delictuelles', name: 'Infractions routières délictuelles' },
    ],
  },
  {
    key: 'droit-des-affaires-commercial',
    name: 'Droit des affaires / commercial',
    practiceAreas: [
      { key: 'creation-dentreprise', name: "Création d'entreprise" },
      { key: 'contrats-commerciaux', name: 'Contrats commerciaux' },
      { key: 'recouvrement-de-creances', name: 'Recouvrement de créances' },
      { key: 'litige-entre-associes', name: 'Litige entre associés' },
      { key: 'procedures-collectives', name: 'Procédures collectives' },
      { key: 'concurrence-deloyale', name: 'Concurrence déloyale' },
      { key: 'baux-commerciaux', name: 'Baux commerciaux' },
    ],
  },
  {
    key: 'droit-immobilier',
    name: 'Droit immobilier',
    practiceAreas: [
      { key: 'vente-immobiliere', name: 'Vente immobilière' },
      { key: 'bail-dhabitation', name: "Bail d'habitation" },
      { key: 'copropriete', name: 'Copropriété' },
      { key: 'construction-et-malfacons', name: 'Construction et malfaçons' },
      { key: 'expropriation', name: 'Expropriation' },
      { key: 'troubles-de-voisinage', name: 'Troubles de voisinage' },
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
      { key: 'recours-contre-decision-administrative', name: 'Recours contre une décision administrative' },
      { key: 'marches-publics', name: 'Marchés publics' },
      { key: 'urbanisme', name: 'Urbanisme' },
      { key: 'fonction-publique', name: 'Fonction publique' },
      { key: 'contentieux-avec-collectivite', name: 'Contentieux avec une collectivité' },
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
      { key: 'recours-contre-oqtf', name: 'Recours contre une OQTF' },
      { key: 'demande-dasile', name: "Demande d'asile" },
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
      { key: 'depot-de-marque-ou-brevet', name: 'Dépôt de marque ou brevet' },
      { key: 'contrefacon', name: 'Contrefaçon' },
      { key: 'droits-dauteur', name: "Droits d'auteur" },
      { key: 'contrats-de-licence', name: 'Contrats de licence' },
    ],
  },
  {
    key: 'droit-des-assurances',
    name: 'Droit des assurances',
    practiceAreas: [
      { key: 'refus-dindemnisation', name: "Refus d'indemnisation" },
      { key: 'sinistre-auto-ou-habitation', name: 'Sinistre auto ou habitation' },
      { key: 'assurance-vie-et-prevoyance', name: 'Assurance vie et prévoyance' },
      { key: 'responsabilite-civile', name: 'Responsabilité civile' },
    ],
  },
  {
    key: 'droit-routier',
    name: 'Droit routier',
    practiceAreas: [
      { key: 'retrait-ou-suspension-de-permis', name: 'Retrait ou suspension de permis' },
      { key: 'contestation-damende', name: "Contestation d'amende" },
      { key: 'accident-de-la-route', name: 'Accident de la route' },
      { key: 'conduite-sous-emprise-alcool-ou-stupefiants', name: "Conduite sous l'emprise d'alcool ou de stupéfiants" },
    ],
  },
  {
    key: 'droit-des-societes',
    name: 'Droit des sociétés',
    practiceAreas: [
      { key: 'constitution-de-societe', name: 'Constitution de société' },
      { key: 'pacte-dassocies', name: "Pacte d'associés" },
      { key: 'cession-de-parts-ou-dactions', name: 'Cession de parts ou d\'actions' },
      { key: 'gouvernance-et-direction', name: 'Gouvernance et direction' },
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
      { key: 'rgpd-et-protection-des-donnees', name: 'RGPD et protection des données' },
      { key: 'cybercriminalite', name: 'Cybercriminalité' },
      { key: 'litiges-e-commerce-et-plateformes', name: 'Litiges e-commerce et plateformes' },
      { key: 'diffamation-et-injure-en-ligne', name: 'Diffamation et injure en ligne' },
    ],
  },
  {
    key: 'droit-de-lenvironnement',
    name: "Droit de l'environnement",
    practiceAreas: [
      { key: 'pollution-et-nuisances', name: 'Pollution et nuisances' },
      { key: 'installations-classees-icpe', name: 'Installations classées (ICPE)' },
      { key: 'droit-rural-et-agricole', name: 'Droit rural et agricole' },
    ],
  },
  {
    key: 'droit-des-transports',
    name: 'Droit des transports',
    practiceAreas: [
      { key: 'litige-de-transport-de-marchandises', name: 'Litige de transport de marchandises' },
      { key: 'accident-de-transport', name: 'Accident de transport' },
      { key: 'contentieux-avec-un-transporteur', name: 'Contentieux avec un transporteur' },
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
