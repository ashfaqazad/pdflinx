// Root layout appends " | PDF Linx" through its title template.
// Titles in seoData already carry the brand, so they must bypass it.
export function pageTitle(title) {
  return /\|\s*PDF Linx\s*$/.test(title) ? { absolute: title } : title;
}
