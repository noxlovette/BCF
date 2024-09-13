import { invalidate } from "$app/navigation";
import type { Actions } from "./$types";

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const endpoint = `${VITE_API_URL}/api/login/`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();

      cookies.set("sessionid", userData.sessionid, { path: "/" });

      return {
        success: true,
        user: {
          username: userData.username,
          email: userData.email,
          isAuthenticated: true,
        },
      };
    } catch (error) {
      console.error("Error logging in:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
} satisfies Actions;
