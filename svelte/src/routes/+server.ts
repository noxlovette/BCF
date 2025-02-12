import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
  return new Response("Method not allowed", { status: 405 });
};
