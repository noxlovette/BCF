import {
  parseCookieOptions,
  turnstileVerify,
  ValidateAccess,
} from "$lib/server";

import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const pass = data.get("password");

    const turnstileToken = data.get("cf-turnstile-response") as string;
    if (!turnstileToken) {
      return fail(400, {
        message: "Please complete the CAPTCHA verification",
      });
    }

    const turnstileResponse = await turnstileVerify(turnstileToken);
    if (!turnstileResponse.ok) {
      return fail(400, {
        message: "Turnstile verification failed",
      });
    }

    if (!username || !pass) {
      return fail(422, { message: "Username, anyone?" });
    }

    try {
      const response = await fetch("/axum/auth/signin", {
        method: "POST",
        body: JSON.stringify({ username, pass }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        return fail(400, { message: error });
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
