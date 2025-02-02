// src/stores.ts
import { writable } from "svelte/store";
import type { Toast } from "./types";

function createPageStore() {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    set,
    increase: () => update(n => n + 1),
    decrease: () => update(n => n > 1 ? n - 1 : 1),
    reset: () => set(1)
  };
}

export const currentPage = createPageStore();

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
