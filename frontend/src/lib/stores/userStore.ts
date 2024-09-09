// src/stores/loadingStore.js
import { writable } from "svelte/store";

export const user = writable(
{
    is_authenticated: false,
    username: "",
    email: "",
}
);

export function setUser(data) {
    user.update((currentState) => ({
    ...currentState,
    ...data
    }    
    ));
}

export function clearUser() {
    user.update(() => ({
    is_authenticated: false,
    username: "",
    email: "",
    }));
}