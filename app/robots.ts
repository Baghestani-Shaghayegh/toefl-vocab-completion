export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/terms', '/privacy', '/dashboard', '/practice', '/auth'],
      },
    ],
    sitemap: 'https://lexivo.io/sitemap.xml',
  }
}