// src/stores/loadingStore.js
import { writable } from "svelte/store";

// Initial state is false since nothing is loading initially
export const isLoading = writable(false);
