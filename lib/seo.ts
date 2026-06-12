export const BASE_URL = 'https://teridox.com'

export function buildAlternates(locale: string, path = '') {
  const suffix = path ? `/${path}` : ''
  return {
    canonical: `${BASE_URL}/${locale}${suffix}`,
    languages: {
      id: `${BASE_URL}/id${suffix}`,
      en: `${BASE_URL}/en${suffix}`,
      'x-default': `${BASE_URL}/id${suffix}`,
    },
  }
}
