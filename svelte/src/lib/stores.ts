// src/stores.ts
import { writable } from "svelte/store";
import type { Toast } from "./types";

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


export const editedFormula = writable({
  id: "",
  name: "",
  description: "",
  solvent: "",
  notes: "",
  ingredients: [],
});


export const notification = writable<Toast>({
  message: null,
  type: null
});

export function clearNotification() {
  notification.update(() => ({
    message: null,
    type: null
  }));
}
