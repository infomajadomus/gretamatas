import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  firstName: z.string().trim().min(1, "Įveskite vardą").max(80),
  lastName: z.string().trim().min(1, "Įveskite pavardę").max(80),
  attending: z.enum(["yes", "no"]),
  isCouple: z.boolean(),
  partnerFirstName: z.string().trim().max(80).optional(),
  partnerLastName: z.string().trim().max(80).optional(),
  mealChoice: z.string().trim().max(40).optional(),
  partnerMealChoice: z.string().trim().max(40).optional(),
  dietaryNotes: z.string().trim().max(500).optional(),
  message: z.string().trim().max(1000).optional(),
});

const meals = [
  { value: "meat", label: "Mėsa" },
  { value: "fish", label: "Žuvis" },
  { value: "vegetarian", label: "Vegetariškas" },
  { value: "vegan", label: "Veganiškas" },
];

interface Props {
  inviteSlug?: string;
}

const DEADLINE = new Date("2026-07-06T23:59:59+03:00").getTime();

export function RsvpForm({ inviteSlug }: Props) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [isCouple, setIsCouple] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  useState(() => undefined);
  if (typeof window !== "undefined" && now === null) {
    // set on first client render
    setTimeout(() => setNow(Date.now()), 0);
  }
  const closed = now !== null && now > DEADLINE;

  if (closed) {
    return (
      <div className="mx-auto max-w-xl rounded-sm border border-border bg-card/60 p-10 text-center backdrop-blur-sm">
        <p className="hairline justify-center">Registracija uždaryta</p>
        <h3 className="mt-6 font-serif text-3xl italic text-primary md:text-4xl">
          Atsakymų laukėme iki 2026 m. liepos 6 d.
        </h3>
        <p className="mt-4 font-serif text-lg italic text-muted-foreground">
          Jei vis dar norite pranešti — susisiekite tiesiogiai su Matu ar Greta.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      attending,
      isCouple,
      partnerFirstName: fd.get("partnerFirstName") || undefined,
      partnerLastName: fd.get("partnerLastName") || undefined,
      mealChoice: (fd.get("mealChoice") as string) || undefined,
      partnerMealChoice: (fd.get("partnerMealChoice") as string) || undefined,
      dietaryNotes: (fd.get("dietaryNotes") as string) || undefined,
      message: (fd.get("message") as string) || undefined,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Patikrinkite formą");
      return;
    }

    setSubmitting(true);
    const v = parsed.data;
    const { error } = await supabase.from("rsvps").insert({
      invite_slug: inviteSlug ?? null,
      first_name: v.firstName,
      last_name: v.lastName,
      attending: v.attending === "yes",
      is_couple: v.isCouple,
      partner_first_name: v.isCouple ? v.partnerFirstName ?? null : null,
      partner_last_name: v.isCouple ? v.partnerLastName ?? null : null,
      meal_choice: v.attending === "yes" ? v.mealChoice ?? null : null,
      partner_meal_choice:
        v.attending === "yes" && v.isCouple ? v.partnerMealChoice ?? null : null,
      dietary_notes: v.dietaryNotes ?? null,
      message: v.message ?? null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Nepavyko išsiųsti. Bandykite dar kartą.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-sm border border-border bg-card/60 p-10 text-center backdrop-blur-sm">
        <p className="hairline justify-center">Ačiū</p>
        <h3 className="mt-6 font-serif text-3xl italic text-primary md:text-4xl">
          Jūsų atsakymas gautas
        </h3>
        <p className="mt-4 font-serif text-lg italic text-muted-foreground">
          Su nekantrumu laukiame šios dienos kartu su Jumis.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-0 transition-colors";
  const labelCls = "block text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-1";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl space-y-8 rounded-sm border border-border bg-card/50 p-6 backdrop-blur-sm sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Vardas</label>
          <input name="firstName" required maxLength={80} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Pavardė</label>
          <input name="lastName" required maxLength={80} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Ar dalyvausite?</label>
        <div className="mt-2 flex gap-3">
          {[
            { v: "yes", l: "Su džiaugsmu dalyvausiu" },
            { v: "no", l: "Deja, negalėsiu" },
          ].map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setAttending(opt.v as "yes" | "no")}
              className={`flex-1 rounded-sm border px-4 py-3 text-sm transition-all ${
                attending === opt.v
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-foreground hover:border-primary/60"
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isCouple}
          onChange={(e) => setIsCouple(e.target.checked)}
          className="h-4 w-4 accent-[var(--sage-deep)]"
        />
        Atsakau už porą (du asmenis)
      </label>

      {isCouple && (
        <div className="grid gap-6 border-l-2 border-accent/40 pl-6 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Antrosios pusės vardas</label>
            <input name="partnerFirstName" maxLength={80} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Antrosios pusės pavardė</label>
            <input name="partnerLastName" maxLength={80} className={inputCls} />
          </div>
        </div>
      )}

      {attending === "yes" && (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Pagrindinis patiekalas</label>
              <select name="mealChoice" className={inputCls} defaultValue="">
                <option value="" disabled>Pasirinkti...</option>
                {meals.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            {isCouple && (
              <div>
                <label className={labelCls}>Antrosios pusės patiekalas</label>
                <select name="partnerMealChoice" className={inputCls} defaultValue="">
                  <option value="" disabled>Pasirinkti...</option>
                  {meals.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Dietos ypatumai / alergijos</label>
            <input name="dietaryNotes" maxLength={500} className={inputCls} />
          </div>
        </>
      )}

      <div>
        <label className={labelCls}>Žinutė porai</label>
        <textarea name="message" maxLength={1000} rows={3} className={inputCls + " resize-none"} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm border border-primary bg-primary px-8 py-4 text-xs uppercase tracking-[0.4em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? "Siunčiama..." : "Patvirtinti"}
      </button>
    </form>
  );
}
