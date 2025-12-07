import type { APIRoute } from "astro";
import { clearAuthToken } from "../../utils/auth.js";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  clearAuthToken(cookies);
  return redirect("/login", 303);
};
