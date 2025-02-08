import { writable } from "svelte/store";

export const user = writable({
  username: "",
  name: "",
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
    username: "",
    name: "",
    email: "",
  }));
}
