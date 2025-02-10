import { turnstileVerify } from "$lib/server";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const username = data.get("username") as string;
    const pass = data.get("password") as string;
    const confirmPassword = data.get("confirmPassword") as string;
    const email = data.get("email") as string;
    const name = data.get("name") as string;

    // Server-side validation
    if (!username || username.length < 3) {
      return fail(400, {
        message: "Username must be at least 3 characters long.",
      });
    }

    if (name.length < 3 || name.length > 16) {
      return fail(400, {
        message: "Name should be between 3 and 16 characters",
      });
    }

    if (!pass || pass.length < 8) {
      return fail(400, {
        message: "Password must be at least 8 characters long.",
      });
    }

    if (!/[a-z]/.test(pass) || !/[A-Z]/.test(pass)) {
      return fail(400, {
        message:
          "Password must contain at least one uppercase and one lowercase letter.",
      });
    }

    if (!/[\W_]/.test(pass)) {
      return fail(400, {
        message: "Password must contain at least one special character.",
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { message: "Invalid email format." });
    }

    if (pass !== confirmPassword) {
      return fail(400, { message: "Passwords do not match." });
    }

    if (!name) {
      return fail(422, { message: "So you're a mister nobody?" });
    }

    const turnstileToken = data.get("cf-turnstile-response") as string;
    if (!turnstileToken) {
      return fail(400, {
        message: "CAPTCHA. You might want to refresh the page",
      });
    }

    const turnstileResponse = await turnstileVerify(turnstileToken);
    if (!turnstileResponse.ok) {
      return fail(400, {
        message: "Turnstile verification failed",
      });
    }

    const body = JSON.stringify({ username, pass, email, name });

    const response = await fetch("/axum/auth/signup", {
      method: "POST",
      body: body,
    });

    if (!response.ok) {
      const { error } = await response.json();
      return fail(400, { message: error });
    }

    const userData = await response.json();

    redirect(301, "/auth/login");
  },
} satisfies Actions;
