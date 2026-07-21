-- ========================================
-- F-02 Migration Verification Queries
-- Run after Phase B data migration
-- ========================================

-- ========================================
-- SUMMARY VALIDATION (quick health check)
-- ========================================

\echo '=== S1: ProfessionalContact count = profiles with phone ==='
SELECT
  (SELECT count(*) FROM "ProfessionalContact") AS "contact_count",
  (SELECT count(*) FROM "ProfessionalProfile" WHERE "professionalPhone" IS NOT NULL) AS "profiles_with_phone",
  CASE
    WHEN (SELECT count(*) FROM "ProfessionalContact") =
         (SELECT count(*) FROM "ProfessionalProfile" WHERE "professionalPhone" IS NOT NULL)
    THEN 'PASS' ELSE 'FAIL'
  END AS "status";

\echo '=== S2: Office count = profiles with address or city ==='
SELECT
  (SELECT count(*) FROM "Office") AS "office_count",
  (SELECT count(*) FROM "ProfessionalProfile"
   WHERE "officeAddress" IS NOT NULL OR "cityId" IS NOT NULL) AS "profiles_with_office_data",
  CASE
    WHEN (SELECT count(*) FROM "Office") =
         (SELECT count(*) FROM "ProfessionalProfile"
          WHERE "officeAddress" IS NOT NULL OR "cityId" IS NOT NULL)
    THEN 'PASS' ELSE 'FAIL'
  END AS "status";

\echo '=== S3: Zero orphan ProfessionalContact records ==='
SELECT
  count(*) AS "orphan_contacts",
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS "status"
FROM "ProfessionalContact" pc
LEFT JOIN "ProfessionalProfile" pp ON pp."id" = pc."profileId"
WHERE pp."id" IS NULL;

\echo '=== S4: Zero orphan Office records ==='
SELECT
  count(*) AS "orphan_offices",
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS "status"
FROM "Office" o
LEFT JOIN "ProfessionalProfile" pp ON pp."id" = o."profileId"
WHERE pp."id" IS NULL;

\echo '=== S5: Zero duplicate profileId in ProfessionalContact ==='
SELECT
  count(*) AS "duplicate_contacts",
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS "status"
FROM (
  SELECT "profileId", count(*) AS c
  FROM "ProfessionalContact"
  GROUP BY "profileId"
  HAVING count(*) > 1
) dupes;

\echo '=== S6: Zero duplicate profileId in Office ==='
SELECT
  count(*) AS "duplicate_offices",
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS "status"
FROM (
  SELECT "profileId", count(*) AS c
  FROM "Office"
  GROUP BY "profileId"
  HAVING count(*) > 1
) dupes;

\echo '=== S7: All ConsultationOffer rows have defaults applied ==='
SELECT
  count(*) AS "incomplete_offers",
  CASE WHEN count(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS "status"
FROM "ConsultationOffer"
WHERE "title" IS NULL OR "active" IS NULL OR "order" IS NULL;

-- ========================================
-- DETAIL VALIDATION (record-level checks)
-- ========================================

\echo '=== V1: Phone values match (legacy -> migrated) ==='
SELECT
  pp."id" AS "profileId",
  pp."professionalPhone" AS "legacyPhone",
  pc."phone" AS "migratedPhone",
  CASE WHEN pc."phone" = pp."professionalPhone" THEN 'MATCH' ELSE 'MISMATCH' END AS "status"
FROM "ProfessionalProfile" pp
LEFT JOIN "ProfessionalContact" pc ON pc."profileId" = pp."id"
WHERE pp."professionalPhone" IS NOT NULL
ORDER BY pp."id";

\echo '=== V2: Office address/city values match (legacy -> migrated) ==='
SELECT
  pp."id" AS "profileId",
  pp."officeAddress" AS "legacyAddress",
  pp."cityId" AS "legacyCityId",
  o."address" AS "migratedAddress",
  o."cityId" AS "migratedCityId",
  CASE
    WHEN o."address" IS NOT DISTINCT FROM pp."officeAddress"
     AND o."cityId" IS NOT DISTINCT FROM pp."cityId"
    THEN 'MATCH' ELSE 'MISMATCH'
  END AS "status"
FROM "ProfessionalProfile" pp
LEFT JOIN "Office" o ON o."profileId" = pp."id"
WHERE pp."officeAddress" IS NOT NULL OR pp."cityId" IS NOT NULL
ORDER BY pp."id";

\echo '=== V3: ConsultationOffer defaults ==='
SELECT
  "id",
  "title",
  "active",
  "order",
  CASE WHEN "title" IS NOT NULL AND "active" IS NOT NULL AND "order" IS NOT NULL
    THEN 'OK' ELSE 'INCOMPLETE' END AS "migrationStatus"
FROM "ConsultationOffer";

\echo '=== V4: Office coordinate CHECK constraint ==='
SELECT
  conname AS "constraint_name",
  CASE WHEN contype = 'c' THEN 'CHECK' ELSE contype::text END AS "constraint_type",
  CASE WHEN convalidated THEN 'VALIDATED' ELSE 'NOT VALIDATED' END AS "status"
FROM pg_constraint
WHERE conrelid = '"Office"'::regclass
  AND conname = 'office_coordinates_pair';
