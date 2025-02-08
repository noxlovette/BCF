import { writable } from "svelte/store";

function createPageStore() {
  const { subscribe, set, update } = writable(1);

  return {
    subscribe,
    set,
    increase: () => update((n) => n + 1),
    decrease: () => update((n) => (n > 1 ? n - 1 : 1)),
    reset: () => set(1),
  };
}

export const currentPage = createPageStore();

export let pageSize = writable(50);
export let searchTerm = writable("");
export const isLoading = writable(false);
