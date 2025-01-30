import type { Handle, HandleFetch } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';

const handle: Handle = async ({ event, resolve }) => {
  const sessionid = event.cookies.get("sessionid");

  if (sessionid) {
    try {
      const response = await event.fetch(`${env.BACKEND_URL}/api/check-session/`, {
        headers: {
          Cookie: `sessionid=${sessionid}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        event.cookies.set("csrftoken", user.csrfToken, { path: "/" });
        event.locals.user = user;
      } else {

        event.locals.user = null;
      }
    } catch (error) {
      console.error("Session check failed:", error);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};


export const handleFetch: HandleFetch = async ({ request, event, fetch }) => {
  const url = new URL(request.url);

  // Create new headers
  const headers = new Headers(request.headers);
  headers.set('Content-Type', 'application/json');

  // Add session ID if it exists
  const sessionId = event.cookies.get('sessionid');
  if (sessionId) {
    headers.set('Cookie', `sessionid=${sessionId}`);
  }

  // Add CSRF token except for login endpoint
  const csrfToken = event.cookies.get('csrftoken');
  if (csrfToken && !url.pathname.endsWith('/api/login/')) {
    headers.set('X-CSRFToken', csrfToken);
  }

  // Handle Django backend URLs
  if (url.pathname.startsWith('/django/')) {
    const cleanPath = url.pathname.replace('/django/', '/');
    const newUrl = new URL(cleanPath, env.BACKEND_URL);

    request = new Request(newUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      credentials: 'include',
      mode: 'cors',
    });
  } else {
    request = new Request(request, {
      headers: headers,
      credentials: 'include'
    });
  }

  return fetch(request);
}