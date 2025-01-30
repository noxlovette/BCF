// src/routes/+layout.server.ts

import type { LayoutServerLoad } from "./$types";
import type { User } from "$lib/types";


export const load: LayoutServerLoad = async ({ cookies, fetch, depends }) => {
    const sessionid = cookies.get("sessionid");
    const endpoint = `/django/api/check-session/`;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Cookie: `sessionid=${sessionid}`,
        },
    });

    let user: User | null = null;
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
