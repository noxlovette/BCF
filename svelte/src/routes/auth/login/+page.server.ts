import { parseCookieOptions } from "$lib/server/cookies";
import { ValidateAccess } from "$lib/server/refresh";
import { error, fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const pass = data.get("password");

    if (!username || !pass) {
      return fail(422, { message: "Username, anyone?" });
    }

    try {
      const response = await fetch("/axum/auth/signin", {
        method: "POST",
        body: JSON.stringify({ username, pass }),
      });
      if (!response.ok) {
        return error(500, "Login failed");
      }

      response.headers.getSetCookie().forEach((cookie) => {
        const [fullCookie, ...opts] = cookie.split(";");
        const [name, value] = fullCookie.split("=");

        const cookieOptions = parseCookieOptions(opts);
        cookies.set(name, value, cookieOptions);
      });

      const { accessToken } = await response.json();
      const user = await ValidateAccess(accessToken);

      if (!user) {
        return fail(401, {
          message: "Invalid access token",
        });
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      return error(500, { message: "An unknown error occurred" });
    }
  },
} satisfies Actions;
