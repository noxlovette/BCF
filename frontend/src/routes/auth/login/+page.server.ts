import {error} from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }
    const VITE_API_URL = "http://backend:8000";
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
        const errorData = await response.json();
        console.log(errorData);
        throw error(401, "Login failed");
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
