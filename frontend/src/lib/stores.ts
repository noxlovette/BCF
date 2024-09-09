// src/stores.ts
import { writable } from "svelte/store";

// Define the individual stores
export let isAuthenticated = writable(false);
export let currentPage = writable(1);
export let pageSize = writable(10);
export let searchTerm = writable("");
