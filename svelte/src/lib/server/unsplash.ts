import { env } from "$env/dynamic/private";

export function getUnsplashURL(query: string) {
  let url = `https://api.unsplash.com/photos/random?client_id=${env.UNSPLASH_ACCESS_KEY}`;

  const processed = query.toLowerCase().replace(/,|\s+/g, "-").trim();

  url += `&query=${encodeURIComponent(processed)}`;
  return url;
}
