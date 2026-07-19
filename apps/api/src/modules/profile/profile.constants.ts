export const COUNTRIES = ['Maroc', 'France', 'Belgique', 'Canada'] as const;

export const NATIONALITIES = [
  'Marocaine',
  'Française',
  'Belge',
  'Canadienne',
] as const;

export const CITIES_BY_COUNTRY: Record<string, readonly string[]> = {
  Maroc: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'],
  France: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'],
  Belgique: ['Bruxelles', 'Anvers', 'Gand', 'Liège', 'Charleroi'],
  Canada: ['Montréal', 'Toronto', 'Vancouver', 'Ottawa', 'Québec'],
};

export function isValidCountry(value: string): boolean {
  return (COUNTRIES as readonly string[]).includes(value);
}

export function isValidNationality(value: string): boolean {
  return (NATIONALITIES as readonly string[]).includes(value);
}

export function isValidCityForCountry(country: string, city: string): boolean {
  const cities = CITIES_BY_COUNTRY[country];
  return cities ? cities.includes(city) : false;
}
