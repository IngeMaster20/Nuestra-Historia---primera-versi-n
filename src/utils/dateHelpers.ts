import { format, differenceInCalendarDays } from "date-fns";
import { es } from "date-fns/locale";

function parseDateOnly(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatLongDate(iso: string): string {
  return format(parseDateOnly(iso), "d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
}

export function formatShortDate(iso: string): string {
  return format(parseDateOnly(iso), "d MMM yyyy", {
    locale: es,
  });
}

export function daysUntilNextOccurrence(iso: string): number {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const original = parseDateOnly(iso);

  let next = new Date(
    today.getFullYear(),
    original.getMonth(),
    original.getDate(),
  );

  if (next < today) {
    next = new Date(
      today.getFullYear() + 1,
      original.getMonth(),
      original.getDate(),
    );
  }

  return differenceInCalendarDays(next, today);
}
