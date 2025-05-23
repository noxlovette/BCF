import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies, fetch }) => {
  const refreshToken = cookies.get("refreshToken");
  const response = await fetch("/axum/auth/refresh", {
    headers: {
      cookie: `refreshToken=${refreshToken}`,
      "X-API-KEY": env.API_KEY_AXUM,
    },
  });

  response.headers.getSetCookie().forEach((cookie) => {
    const [fullCookie, ...opts] = cookie.split(";");
    const [name, value] = fullCookie.split("=");

    // Create a more robust options parser
    const cookieOpts: Record<string, string | boolean> = {};
    opts.forEach((opt) => {
      const [key, val] = opt.trim().split("=");
      // Normalize keys by removing hyphens and lowercasing
      cookieOpts[key.toLowerCase().replace(/-/g, "")] = val || true;
    });

    cookies.set(name, value, {
      path: (cookieOpts.path as string) || "/",
      httpOnly: "httponly" in cookieOpts,
      secure: "secure" in cookieOpts,
      sameSite: (cookieOpts.samesite as "lax" | "strict" | "none") || "lax",
      domain: cookieOpts.domain as string,
      // Look for both max-age and maxage
      maxAge: cookieOpts.maxage
        ? parseInt(cookieOpts.maxage as string)
        : cookieOpts["max-age"]
          ? parseInt(cookieOpts["max-age"] as string)
          : undefined,
    });
  });

  const { accessToken } = await response.json();

  return json({ success: true, accessToken });
};
