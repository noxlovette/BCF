import type { RequestEvent } from '@sveltejs/kit';
import { importSPKI, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export async function ValidateAccess(jwt: string) {
    const spki = env.spki || '';
    const alg = env.alg || 'RS256';
    const publicKey = await importSPKI(spki, alg);

    const { payload } = await jwtVerify(jwt, publicKey, {
        issuer: 'auth:auth'
    });


    const EXPIRY_BUFFER = 30;
    if (payload.exp && typeof payload.exp === 'number') {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp - now < EXPIRY_BUFFER) {
            throw new Error('Token about to expire');
        }
    }

    return payload;
}

let isRefreshing = false;

export async function handleTokenRefresh(event: RequestEvent) {
    if (isRefreshing) {
        while (isRefreshing) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return null;
    }

    isRefreshing = true;
    const refreshToken = event.cookies.get('refreshToken');

    try {
        const refreshRes = await event.fetch('/auth/refresh', {
            headers: {
                Cookie: `refreshToken=${refreshToken}`,
                Accept: 'application/json'
            }
        });

        if (!refreshRes.ok) {
            throw new Error('Refresh failed');
        }

        const newAccessToken = event.cookies.get('accessToken');
        if (newAccessToken) {
            return await ValidateAccess(newAccessToken);
        }
    } catch (error) {
        throw redirect(302, '/auth/login');
    } finally {
        isRefreshing = false;
    }
}