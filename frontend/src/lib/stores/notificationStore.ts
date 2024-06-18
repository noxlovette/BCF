// src/stores/notificationStore.js
import { writable } from "svelte/store";

export const notification = writable({
  message: "",
  type: "none", // 'success', 'error', or 'none'
});
