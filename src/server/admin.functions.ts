import { createServerFn } from "@tanstack/react-start";
import { setCookie, getCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const COOKIE = "wedding_admin";

function isAuthed() {
  const c = getCookie(COOKIE);
  return c === process.env.ADMIN_PASSWORD;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: { password: string }) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || data.password !== expected) {
      return { ok: false as const };
    }
    setCookie(COOKIE, expected, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});

export const adminCheck = createServerFn({ method: "GET" }).handler(async () => ({
  authed: isAuthed(),
}));

export const adminListRsvps = createServerFn({ method: "GET" }).handler(async () => {
  if (!isAuthed()) throw new Error("UNAUTHORIZED");
  const { data, error } = await supabaseAdmin
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { rsvps: data ?? [] };
});

export const adminListGuests = createServerFn({ method: "GET" }).handler(async () => {
  if (!isAuthed()) throw new Error("UNAUTHORIZED");
  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { guests: data ?? [] };
});

const guestSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9_-]+$/i, "Tik raidės, skaičiai, - ir _"),
  display_name: z.string().trim().min(1).max(120),
  greeting: z.string().trim().max(120).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const adminUpsertGuest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => guestSchema.parse(d))
  .handler(async ({ data }) => {
    if (!isAuthed()) throw new Error("UNAUTHORIZED");
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("guests")
        .update({
          slug: data.slug.toLowerCase(),
          display_name: data.display_name,
          greeting: data.greeting || null,
          note: data.note || null,
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("guests").insert({
        slug: data.slug.toLowerCase(),
        display_name: data.display_name,
        greeting: data.greeting || null,
        note: data.note || null,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminDeleteGuest = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    if (!isAuthed()) throw new Error("UNAUTHORIZED");
    const { error } = await supabaseAdmin.from("guests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
