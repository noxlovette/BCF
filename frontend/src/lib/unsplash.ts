
const UNSPLASH_URL = "https://api.unsplash.com/";

export default function getUnsplashURL(query:string) {
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  let url = `${UNSPLASH_URL}/photos/random?client_id=${ACCESS_KEY}`;

  const processed = query
  .toLowerCase()                       // Convert to lowercase
        .replace(/,|\s+/g, '-')              // Replace commas and spaces with hyphens
        .trim();

  url += `&query=${encodeURIComponent(processed)}`;
  return url;
}
