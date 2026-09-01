import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRelationshipCounter } from "@/hooks/useRelationshipCounter";
import { listMemories } from "@/services/memories.service";
import { listNotes } from "@/services/notes.service";
import { listImportantDates } from "@/services/dates.service";
import { daysUntilNextOccurrence, formatShortDate } from "@/utils/dateHelpers";
import type { Memory, Note, ImportantDate } from "@/types";

// Fecha en que comenzó la relación — ajústala en Configuración más adelante.
const RELATIONSHIP_START = "2025-09-07";

const phrases = [
  "Hoy también es un buen día para crear un recuerdo.",
  "Cada notita es una pequeña prueba de que pensamos el uno en el otro.",
  "Nuestra historia sigue escribiéndose, un día a la vez.",
  "Guarda este momento — algún día será un recuerdo favorito.",
];

export function Dashboard() {
  const { profile } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);

  const elapsed = useRelationshipCounter(RELATIONSHIP_START);
  const phrase = useMemo(
    () => phrases[Math.floor(Math.random() * phrases.length)],
    [],
  );

  useEffect(() => {
    Promise.all([listMemories(), listNotes(), listImportantDates()])
      .then(([m, n, d]) => {
        setMemories(m);
        setNotes(n);
        setDates(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPhotos = memories.reduce(
    (acc, m) => acc + (m.photos?.length ?? 0),
    0,
  );
  const nextDate = dates
    .map((d) => ({ ...d, daysLeft: daysUntilNextOccurrence(d.date) }))
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-plum dark:text-blush">
        Hola, {profile?.name ?? ""} ❤️
      </h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-blush/60">{phrase}</p>

      <div className="surface-card mt-6 p-6 text-center">
        <p className="text-xs uppercase tracking-wide text-ink-soft dark:text-blush/50">
          Juntos desde: {formatShortDate(RELATIONSHIP_START)}
        </p>
        {elapsed && (
          <p className="mt-1 font-display text-xl text-plum dark:text-blush">
            {elapsed.years} años, {elapsed.months} meses y {elapsed.days} días
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Recuerdos" value={memories.length} to="/libro" />
        <Stat label="Fotos" value={totalPhotos} to="/fotos" />
        <Stat label="Notitas" value={notes.length} to="/notitas" />
      </div>

      {!loading && nextDate && (
        <Link
          to="/fechas"
          className="surface-card mt-6 flex items-center justify-between p-5 transition-transform hover:-translate-y-0.5"
        >
          <div>
            <p className="text-xs text-ink-soft dark:text-blush/50">
              Próxima fecha especial
            </p>
            <p className="font-display text-lg text-plum dark:text-blush">
              {nextDate.title}
            </p>
          </div>
          <span className="rounded-full bg-blush/60 px-3 py-1 text-sm text-rose-deep dark:bg-night dark:text-gold">
            faltan {nextDate.daysLeft} días
          </span>
        </Link>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  to,
}: {
  label: string;
  value: number;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="surface-card flex flex-col items-center gap-1 py-5 text-center"
    >
      <span className="font-display text-2xl text-plum dark:text-blush">
        {value}
      </span>
      <span className="text-xs text-ink-soft dark:text-blush/50">{label}</span>
    </Link>
  );
}
