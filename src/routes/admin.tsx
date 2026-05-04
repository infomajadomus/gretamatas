import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminCheck,
  adminLogin,
  adminLogout,
  adminListRsvps,
  adminListGuests,
  adminUpsertGuest,
  adminDeleteGuest,
} from "@/server/admin.functions";
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
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
        className="w-full max-w-sm space-y-6 rounded-sm border border-border bg-card p-10 shadow-luxe"
      >
        <h1 className="font-script text-5xl text-primary">Admin</h1>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Slaptažodis"
          className="w-full border-0 border-b border-border bg-transparent px-0 py-3 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !pw}
          className="w-full rounded-sm bg-primary px-6 py-3 font-display text-xs uppercase text-primary-foreground disabled:opacity-50"
          style={{ letterSpacing: "0.3em" }}
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
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-script text-5xl text-primary md:text-6xl">Admin</h1>
            <p className="font-serif italic text-muted-foreground">Matas &amp; Greta · 2026.09.06</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              onLogout();
            }}
            className="rounded-sm border border-border px-4 py-2 font-display text-xs uppercase hover:bg-card"
            style={{ letterSpacing: "0.25em" }}
          >
            Atsijungti
          </button>
        </div>

        <div className="mb-8 flex gap-2 border-b border-border">
          {[
            { k: "rsvps", l: "Atsakymai" },
            { k: "guests", l: "Svečių nuorodos" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as "rsvps" | "guests")}
              className={`px-5 py-3 font-display text-xs uppercase transition-colors ${
                tab === t.k ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
              }`}
              style={{ letterSpacing: "0.3em" }}
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

  if (!rsvps) return <p className="text-muted-foreground">Kraunama…</p>;

  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const totalPeople = yes.reduce((acc, r) => acc + (r.is_couple ? 2 : 1), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Atsakymų" value={rsvps.length} />
        <Stat label="Dalyvauja" value={`${yes.length} (${totalPeople} žm.)`} />
        <Stat label="Negali" value={no.length} />
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left font-display uppercase text-muted-foreground" style={{ letterSpacing: "0.15em", fontSize: "0.65rem" }}>
            <tr>
              <th className="p-3">Vardas</th>
              <th className="p-3">Dalyvauja</th>
              <th className="p-3">Pora</th>
              <th className="p-3">Patiekalas</th>
              <th className="p-3">Dieta</th>
              <th className="p-3">Žinutė</th>
              <th className="p-3">Iš nuorodos</th>
              <th className="p-3">Kada</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-b border-border/50 align-top">
                <td className="p-3 font-serif">
                  {r.first_name} {r.last_name}
                  {r.is_couple && r.partner_first_name && (
                    <div className="text-xs italic text-muted-foreground">
                      + {r.partner_first_name} {r.partner_last_name}
                    </div>
                  )}
                </td>
                <td className="p-3">{r.attending ? "✓" : "—"}</td>
                <td className="p-3">{r.is_couple ? "Pora" : "1"}</td>
                <td className="p-3">
                  {r.meal_choice || "—"}
                  {r.partner_meal_choice && <div>+ {r.partner_meal_choice}</div>}
                </td>
                <td className="p-3 text-xs">{r.dietary_notes || "—"}</td>
                <td className="p-3 text-xs italic">{r.message || "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{r.invite_slug || "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString("lt-LT")}
                </td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center italic text-muted-foreground">Dar nėra atsakymų</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-border bg-card p-5">
      <p className="font-display text-xs uppercase text-muted-foreground" style={{ letterSpacing: "0.3em" }}>
        {label}
      </p>
      <p className="mt-2 font-script text-4xl text-primary">{value}</p>
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

  if (!guests) return <p className="text-muted-foreground">Kraunama…</p>;

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-serif italic text-muted-foreground">
          Sukurk nuorodą kiekvienam svečiui — su jų vardu kreipinyje.
        </p>
        <button
          onClick={() => setEditing({ slug: "", display_name: "", greeting: "", note: "" })}
          className="rounded-sm bg-primary px-5 py-2 font-display text-xs uppercase text-primary-foreground"
          style={{ letterSpacing: "0.3em" }}
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
              toast.error((e as Error).message || "Klaida");
            }
          }}
        />
      )}

      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left font-display uppercase text-muted-foreground" style={{ letterSpacing: "0.15em", fontSize: "0.65rem" }}>
            <tr>
              <th className="p-3">Vardas</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Kreipinys</th>
              <th className="p-3">Nuoroda</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => {
              const url = `${origin}/?kam=${encodeURIComponent(g.slug)}`;
              return (
                <tr key={g.id} className="border-b border-border/50">
                  <td className="p-3 font-serif">{g.display_name}</td>
                  <td className="p-3 text-xs text-muted-foreground">{g.slug}</td>
                  <td className="p-3 text-xs italic">{g.greeting || "—"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        toast.success("Nuoroda nukopijuota");
                      }}
                      className="text-xs italic text-primary underline"
                    >
                      Kopijuoti
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setEditing(g)}
                      className="mr-3 text-xs italic text-primary"
                    >
                      Keisti
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Ištrinti?")) return;
                        await del({ data: { id: g.id } });
                        refresh();
                      }}
                      className="text-xs italic text-destructive"
                    >
                      Trinti
                    </button>
                  </td>
                </tr>
              );
            })}
            {guests.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center italic text-muted-foreground">Dar nėra svečių nuorodų</td></tr>
            )}
          </tbody>
        </table>
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

  return (
    <div className="rounded-sm border border-primary/30 bg-card p-6">
      <h3 className="mb-4 font-script text-3xl text-primary">{initial.id ? "Keisti svečią" : "Naujas svečias"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vardas (pvz. Greta)">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border-0 border-b border-border bg-transparent py-2 focus:border-primary focus:outline-none" />
        </Field>
        <Field label="Slug (URL, pvz. greta arba teveliai)">
          <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))} className="w-full border-0 border-b border-border bg-transparent py-2 focus:border-primary focus:outline-none" />
        </Field>
        <Field label="Pasirinktinis kreipinys (paliek tuščią — sugeneruos)">
          <input
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder='pvz. "Mieli Tėveliai,"'
            className="w-full border-0 border-b border-border bg-transparent py-2 focus:border-primary focus:outline-none"
          />
        </Field>
        <Field label="Vidinė pastaba">
          <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full border-0 border-b border-border bg-transparent py-2 focus:border-primary focus:outline-none" />
        </Field>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave({ id: initial.id, slug, display_name: name, greeting: greeting || undefined, note: note || undefined })}
          disabled={!slug || !name}
          className="rounded-sm bg-primary px-6 py-2 font-display text-xs uppercase text-primary-foreground disabled:opacity-50"
          style={{ letterSpacing: "0.3em" }}
        >
          Išsaugoti
        </button>
        <button onClick={onCancel} className="rounded-sm border border-border px-6 py-2 font-display text-xs uppercase" style={{ letterSpacing: "0.3em" }}>
          Atšaukti
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-display text-[0.6rem] uppercase text-muted-foreground" style={{ letterSpacing: "0.3em" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
