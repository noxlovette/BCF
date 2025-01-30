import type { ClientInit } from '@sveltejs/kit';
import { setUser } from '$lib/stores';

export const init: ClientInit = async () => {
    const user = localStorage.getItem('user') || '';
    if (user) {
        setUser(JSON.parse(user));
    }
};
