export const resolveAsset = (url: string | undefined | null): string => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  // Normalize leading slash for subpath hosting such as GitHub Pages
  if (url.startsWith('/assets/')) {
    return '.' + url;
  }
  if (url.startsWith('assets/')) {
    return './' + url;
  }
  return url;
};
