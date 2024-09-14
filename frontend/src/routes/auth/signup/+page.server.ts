import {error} from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const csrfToken = cookies.get("csrftoken");
    const username = data.get("username");
    const password = data.get("password");
    const email = data.get("email");
    const body = JSON.stringify({ username, password, email });

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }
    const VITE_API_URL = "http://backend:8000";
    const endpoint = `${VITE_API_URL}/api/signup/`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: body,
        credentials: "include",
      });
        
        if (!response.ok) {
        throw error(400, "Signup failed");
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

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  },
} satisfies Actions;
