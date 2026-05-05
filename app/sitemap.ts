export default function sitemap() {
  return [
    { url: 'https://lexivo.io', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://lexivo.io/practice/sample', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://lexivo.io/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://lexivo.io/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}