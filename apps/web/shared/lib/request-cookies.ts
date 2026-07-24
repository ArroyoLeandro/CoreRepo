import { cookies } from "next/headers";

/** Cookie header for server-side api-client calls. */
export async function getRequestCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");
}
