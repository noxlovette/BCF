import { setUser } from "$lib/stores";
import type { ClientInit } from "@sveltejs/kit";

export const init: ClientInit = async () => {
  const user = localStorage.getItem("user") || "";
  if (user) {
    setUser(JSON.parse(user));
  }
};
