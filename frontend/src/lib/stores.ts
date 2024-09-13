// src/stores.ts
import { writable } from "svelte/store";

// Define the individual stores
export let isAuthenticated = writable(false);
export let currentPage = writable(1);
export let pageSize = writable(50);
export let searchTerm = writable("");
export let secondSearchTerm = writable("");
export const isLoading = writable(false);

export const user = writable({
  is_authenticated: false,
  username: "",
  email: "",
});

export function setUser(data) {
  user.update((currentState) => ({
    ...currentState,
    ...data,
  }));
}

export function clearUser() {
  user.update(() => ({
    is_authenticated: false,
    username: "",
    email: "",
  }));
}

export const notification = writable({
  message: "",
  type: "none",
});

export const editedFormula = writable({
  id: "",
  name: "",
  description: "",
  solvent: "",
  notes: "",
  ingredients: [],
});
