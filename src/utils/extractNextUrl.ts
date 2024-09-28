export default function extractNextUrl(linkHeader: string): string | null {
  const links = linkHeader.split(',');
  const nextLink = links.find((link) => link.includes('rel="next"'));
  if (nextLink) {
    const match = nextLink.match(/<([^>]*)>/);
    return match ? match[1] : null;
  }
  return null;
}
