export function validateURL(url?: string): string | undefined {
    if (!url) return undefined;
   
    try {
      const parsed = new URL(url);
  
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(`URL must start with http or https: ${url}`);
      }
   
      return url;
    } catch (err) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }