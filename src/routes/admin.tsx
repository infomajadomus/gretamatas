import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createServerFn } from '@tanstack/start'
import * as admin from '@/server/admin.functions'

const adminCheck = createServerFn().handler(admin.adminCheck)
const adminLogin = createServerFn().handler(admin.adminLogin)
const adminLogout = createServerFn().handler(admin.adminLogout)
const adminListRsvps = createServerFn().handler(admin.adminListRsvps)
const adminListGuests = createServerFn().handler(admin.adminListGuests)
const adminUpsertGuest = createServerFn().handler(admin.adminUpsertGuest)
const adminDeleteGuest = createServerFn().handler(admin.adminDeleteGuest)
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Matas & Greta" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

interface Rsvp {
  id: string;
  invite_slug: string | null;
  first_name: string;
  last_name: string;
  attending: boolean;
  is_couple: boolean;
  partner_first_name: string | null;
  partner_last_name: string | null;
  meal_choice: string | null;
  partner_meal_choice: string | null;
  dietary_notes: string | null;
  message: string | null;
  created_at: string;
}

interface Guest {
  id: string;
  slug: string;
  display_name: string;
  greeting: string | null;
  note: string | null;
}

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const check = useServerFn(adminCheck);

  useEffect(() => {
    check().then((r) => setAuthed(r.authed)).catch(() => setAuthed(false));
  }, [check]);

  if (authed === null) {
    return <div className="flex min-h-screen items-center justify-center font-serif italic text-muted-foreground">Kraunama…</div>;
  }
  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(adminLogin);
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(160deg, var(--ivory) 0%, color-mix(in oklab, var(--moss) 12%, var(--ivory)) 100%)",
      }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const r = await login({ data: { password: pw } });
            if (r.ok) onSuccess();
            else toast.error("Neteisingas slaptažodis");
          } finally {
            setLoading(false);
          }
        }}
        className="w-full max-w-sm space-y-7 rounded-sm border border-primary/15 bg-card p-12 shadow-luxe"
      >
        <div className="text-center">
          <p className="font-display text-[0.65rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.5em" }}>
            ◈ Privatu ◈
          </p>
          <h1 className="mt-4 font-serif text-5xl italic text-primary">Admin</h1>
          <p className="mt-2 font-serif italic text-muted-foreground">Matas &amp; Greta</p>
        </div>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Slaptažodis"
          className="w-full border-0 border-b border-border bg-transparent px-0 py-3 text-center font-serif italic text-lg text-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !pw}
          className="w-full rounded-sm bg-primary px-6 py-4 font-display text-xs uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ letterSpacing: "0.4em" }}
        >
          {loading ? "..." : "Prisijungti"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"rsvps" | "guests">("rsvps");
  const logout = useServerFn(adminLogout);

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{
        background:
          "linear-gradient(180deg, var(--ivory) 0%, color-mix(in oklab, var(--moss) 6%, var(--ivory)) 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between border-b border-primary/15 pb-8">
          <div>
            <p className="font-display text-[0.65rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.45em" }}>
              ◈ Vestuvių valdymas ◈
            </p>
            <h1 className="mt-3 font-serif text-5xl italic text-primary md:text-6xl">
              Matas &amp; Greta
            </h1>
            <p className="mt-2 font-serif italic text-muted-foreground">
              2026 · 09 · 06 · Vilnius
            </p>
          </div>
          <button
            onClick={async () => {
              await logout();
              onLogout();
            }}
            className="rounded-sm border border-primary/30 bg-card px-5 py-2.5 font-display text-[0.65rem] uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
            style={{ letterSpacing: "0.35em" }}
          >
            Atsijungti
          </button>
        </div>

        <div className="mb-10 flex justify-center gap-1 rounded-sm border border-primary/15 bg-card p-1.5">
          {[
            { k: "rsvps", l: "Atsakymai" },
            { k: "guests", l: "Svečių nuorodos" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as "rsvps" | "guests")}
              className={`flex-1 rounded-sm px-6 py-3 font-display text-[0.7rem] uppercase transition-all ${
                tab === t.k
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ letterSpacing: "0.4em" }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {tab === "rsvps" ? <RsvpList /> : <GuestList />}
      </div>
    </div>
  );
}

function RsvpList() {
  const list = useServerFn(adminListRsvps);
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);

  useEffect(() => {
    list().then((r) => setRsvps(r.rsvps as Rsvp[])).catch(() => setRsvps([]));
  }, [list]);

  if (!rsvps) return <p className="text-center font-serif italic text-muted-foreground">Kraunama…</p>;

  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const totalPeople = yes.reduce((acc, r) => acc + (r.is_couple ? 2 : 1), 0);
  const meals: Record<string, number> = {};
  yes.forEach((r) => {
    if (r.meal_choice) meals[r.meal_choice] = (meals[r.meal_choice] || 0) + 1;
    if (r.partner_meal_choice) meals[r.partner_meal_choice] = (meals[r.partner_meal_choice] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Atsakymų" value={rsvps.length} />
        <Stat label="Dalyvauja" value={yes.length} accent />
        <Stat label="Žmonių" value={totalPeople} accent />
        <Stat label="Negali" value={no.length} />
      </div>

      {Object.keys(meals).length > 0 && (
        <div className="rounded-sm border border-primary/15 bg-card p-6">
          <p className="mb-4 font-display text-[0.65rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.4em" }}>
            Patiekalai
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(meals).map(([m, n]) => (
              <span key={m} className="rounded-sm border border-primary/20 bg-background px-4 py-2 font-serif italic">
                {mealLabel(m)} · <span className="font-display text-primary">{n}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-sm border border-primary/15 bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead
              className="border-b border-primary/15 text-left font-display uppercase text-muted-foreground"
              style={{ letterSpacing: "0.2em", fontSize: "0.6rem" }}
            >
              <tr>
                <th className="p-4">Svečias</th>
                <th className="p-4">Statusas</th>
                <th className="p-4">Patiekalas</th>
                <th className="p-4">Dieta</th>
                <th className="p-4">Žinutė</th>
                <th className="p-4">Iš nuorodos</th>
                <th className="p-4">Kada</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((r) => (
                <tr key={r.id} className="border-b border-primary/10 align-top transition-colors hover:bg-background/40">
                  <td className="p-4 font-serif">
                    <div className="text-base italic">{r.first_name} {r.last_name}</div>
                    {r.is_couple && r.partner_first_name && (
                      <div className="mt-1 text-xs italic text-muted-foreground">
                        + {r.partner_first_name} {r.partner_last_name}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {r.attending ? (
                      <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary/10 px-3 py-1 font-display text-[0.6rem] uppercase text-primary" style={{ letterSpacing: "0.25em" }}>
                        ✓ {r.is_couple ? "Pora" : "Taip"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-muted px-3 py-1 font-display text-[0.6rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.25em" }}>
                        — Negali
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-serif italic">
                    {mealLabel(r.meal_choice) || <span className="text-muted-foreground">—</span>}
                    {r.partner_meal_choice && <div className="text-xs">+ {mealLabel(r.partner_meal_choice)}</div>}
                  </td>
                  <td className="p-4 font-serif italic text-xs">{r.dietary_notes || <span className="text-muted-foreground">—</span>}</td>
                  <td className="p-4 font-serif italic text-xs max-w-[200px]">{r.message || <span className="text-muted-foreground">—</span>}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">{r.invite_slug || "—"}</td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("lt-LT", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
              {rsvps.length === 0 && (
                <tr><td colSpan={7} className="p-12 text-center font-serif italic text-muted-foreground">Dar nėra atsakymų</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function mealLabel(m: string | null) {
  if (!m) return "";
  return { meat: "Mėsa", fish: "Žuvis", vegetarian: "Vegetariškas", vegan: "Veganiškas" }[m] || m;
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className={`rounded-sm border p-6 transition-all ${
        accent ? "border-primary/30 bg-primary/5" : "border-primary/15 bg-card"
      }`}
    >
      <p className="font-display text-[0.6rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.4em" }}>
        {label}
      </p>
      <p className="mt-3 font-serif text-5xl italic text-primary">{value}</p>
    </div>
  );
}

function GuestList() {
  const list = useServerFn(adminListGuests);
  const upsert = useServerFn(adminUpsertGuest);
  const del = useServerFn(adminDeleteGuest);
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [editing, setEditing] = useState<Partial<Guest> | null>(null);

  const refresh = () => list().then((r) => setGuests(r.guests as Guest[])).catch(() => setGuests([]));
  useEffect(() => { refresh(); }, []);

  if (!guests) return <p className="text-center font-serif italic text-muted-foreground">Kraunama…</p>;

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif italic text-muted-foreground">
          Sukurkite nuorodą kiekvienam svečiui — su jų vardu kreipinyje.
        </p>
        <button
          onClick={() => setEditing({ slug: "", display_name: "", greeting: "", note: "" })}
          className="rounded-sm bg-primary px-6 py-3 font-display text-[0.65rem] uppercase text-primary-foreground transition-opacity hover:opacity-90"
          style={{ letterSpacing: "0.4em" }}
        >
          + Naujas svečias
        </button>
      </div>

      {editing && (
        <GuestForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={async (data) => {
            try {
              await upsert({ data });
              toast.success("Išsaugota");
              setEditing(null);
              refresh();
            } catch (e) {
              const msg = (e as Error).message || "Klaida";
              toast.error(
                msg.includes("duplicate") || msg.includes("unique")
                  ? "Toks slug jau egzistuoja — pasirink kitą"
                  : msg,
              );
            }
          }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {guests.map((g) => {
          const url = `${origin}/?kam=${encodeURIComponent(g.slug)}`;
          return (
            <div key={g.id} className="group relative rounded-sm border border-primary/15 bg-card p-6 shadow-soft transition-all hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl italic text-primary">{g.display_name}</h3>
                  <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground">/{g.slug}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 font-display text-[0.55rem] uppercase text-primary" style={{ letterSpacing: "0.3em" }}>
                  Svečias
                </span>
              </div>
              {g.greeting && (
                <p className="mt-4 font-serif italic text-muted-foreground">„{g.greeting}"</p>
              )}
              {g.note && (
                <p className="mt-2 text-xs italic text-muted-foreground/70">{g.note}</p>
              )}
              <div className="mt-5 flex items-center justify-between gap-2 rounded-sm border border-dashed border-primary/20 bg-background/50 px-3 py-2">
                <span className="truncate font-mono text-xs text-muted-foreground">{url}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.success("Nuoroda nukopijuota");
                  }}
                  className="shrink-0 rounded-sm bg-primary/10 px-3 py-1.5 font-display text-[0.6rem] uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  style={{ letterSpacing: "0.3em" }}
                >
                  Kopijuoti
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditing(g)}
                  className="flex-1 rounded-sm border border-primary/30 px-3 py-2 font-display text-[0.6rem] uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  style={{ letterSpacing: "0.3em" }}
                >
                  Keisti
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Ištrinti „${g.display_name}"?`)) return;
                    try {
                      await del({ data: { id: g.id } });
                      toast.success("Ištrinta");
                      refresh();
                    } catch (e) {
                      toast.error((e as Error).message);
                    }
                  }}
                  className="rounded-sm border border-destructive/40 px-3 py-2 font-display text-[0.6rem] uppercase text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                  style={{ letterSpacing: "0.3em" }}
                >
                  Trinti
                </button>
              </div>
            </div>
          );
        })}
        {guests.length === 0 && !editing && (
          <div className="md:col-span-2 rounded-sm border border-dashed border-primary/20 bg-card/50 p-12 text-center">
            <p className="font-serif text-xl italic text-muted-foreground">Dar nėra svečių nuorodų</p>
            <p className="mt-2 font-serif italic text-muted-foreground/70">Spauskite „+ Naujas svečias", kad pradėtumėte</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GuestForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Partial<Guest>;
  onCancel: () => void;
  onSave: (d: { id?: string; slug: string; display_name: string; greeting?: string; note?: string }) => void;
}) {
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [name, setName] = useState(initial.display_name ?? "");
  const [greeting, setGreeting] = useState(initial.greeting ?? "");
  const [note, setNote] = useState(initial.note ?? "");

  // Auto-generate slug from name
  const autoSlug = (s: string) =>
    s
      .toLowerCase()
      .replace(/ą/g, "a").replace(/č/g, "c").replace(/ę/g, "e").replace(/ė/g, "e")
      .replace(/į/g, "i").replace(/š/g, "s").replace(/ų/g, "u").replace(/ū/g, "u").replace(/ž/g, "z")
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <div className="rounded-sm border border-primary/30 bg-card p-8 shadow-luxe">
      <h3 className="mb-6 font-serif text-3xl italic text-primary">
        {initial.id ? "Keisti svečią" : "Naujas svečias"}
      </h3>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Vardas (pvz. Greta)">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initial.id && (!slug || slug === autoSlug(name))) {
                setSlug(autoSlug(e.target.value));
              }
            }}
            className="w-full border-0 border-b border-border bg-transparent py-2 font-serif italic text-lg focus:border-primary focus:outline-none"
          />
        </Field>
        <Field label="Slug (URL dalis, pvz. greta)">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
            className="w-full border-0 border-b border-border bg-transparent py-2 font-mono text-sm focus:border-primary focus:outline-none"
          />
        </Field>
        <Field label='Pasirinktinis kreipinys (pvz. "Mieli Tėveliai,")'>
          <input
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Paliekant tuščią — sugeneruos automatiškai"
            className="w-full border-0 border-b border-border bg-transparent py-2 font-serif italic focus:border-primary focus:outline-none"
          />
        </Field>
        <Field label="Vidinė pastaba (tik admin)">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border-0 border-b border-border bg-transparent py-2 font-serif italic focus:border-primary focus:outline-none"
          />
        </Field>
      </div>
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => onSave({ id: initial.id, slug, display_name: name, greeting: greeting || undefined, note: note || undefined })}
          disabled={!slug || !name}
          className="rounded-sm bg-primary px-8 py-3 font-display text-[0.65rem] uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ letterSpacing: "0.4em" }}
        >
          Išsaugoti
        </button>
        <button
          onClick={onCancel}
          className="rounded-sm border border-primary/30 px-8 py-3 font-display text-[0.65rem] uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
          style={{ letterSpacing: "0.4em" }}
        >
          Atšaukti
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-[0.55rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.4em" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
