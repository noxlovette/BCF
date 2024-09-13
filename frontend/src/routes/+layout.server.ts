// src/routes/+layout.server.ts

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch, depends }) => {
  const VITE_API_URL = "http://backend:8000";
  const sessionid = cookies.get("sessionid");
  const endpoint = `${VITE_API_URL}/api/check-session/`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Cookie: `sessionid=${sessionid}`,
    },
  });


  let user: App.User | null = null;
  if (response.status === 401) {
    return { user: null };
  }

  try {
    user = await response.json();
  } catch (error) {
    console.error("Error parsing JSON response", error);
    return { user: null };
  }

  cookies.set("csrftoken", user.csrfToken, { path: "/" });
  depends("app:user:login");
  return { user };
};
