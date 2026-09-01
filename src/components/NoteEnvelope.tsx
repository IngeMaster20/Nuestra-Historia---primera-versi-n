import { useState } from "react";
import { formatLongDate } from "@/utils/dateHelpers";
import { ReactionBar } from "@/components/ReactionBar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { deleteNote } from "@/services/notes.service";
import type { Note } from "@/types";

export function NoteEnvelope({ note }: { note: Note }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const isAuthor = user?.id === note.user_id;

  async function handleDelete() {
    setDeleting(true);

    try {
      await deleteNote(note.id);
      showToast("Notita eliminada");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "No se pudo eliminar",
        "error",
      );

      setDeleting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="surface-card flex w-full flex-col items-center gap-2 px-6 py-10 text-center transition-transform hover:-translate-y-0.5"
      >
        <span className="text-3xl">✉️</span>

        <p className="font-display text-lg text-plum dark:text-blush">
          {note.title || "Una notita para ti"}
        </p>

        <p className="text-xs text-ink-soft dark:text-blush/50">
          {formatLongDate(note.date)}
        </p>
      </button>
    );
  }

  return (
    <div className="animate-envelope surface-card p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-ink-soft dark:text-blush/50">
          {formatLongDate(note.date)}
        </p>

        <button
          onClick={() => setOpen(false)}
          className="text-xs text-ink-soft underline dark:text-blush/50"
        >
          cerrar
        </button>
      </div>

      {note.title && (
        <h3 className="font-display text-lg text-plum dark:text-blush">
          💌 {note.title}
        </h3>
      )}

      {note.photo?.url && (
        <img
          src={note.photo.url}
          alt=""
          className="my-3 max-h-72 w-full rounded-xl object-cover"
        />
      )}

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink dark:text-blush/90">
        {note.content}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg">{note.emoji ?? "❤️"}</span>

        <span className="text-xs text-ink-soft dark:text-blush/50">
          — {note.author?.name ?? "Anónimo"}
        </span>
      </div>

      <div className="mt-3 border-t border-rose/15 pt-3 dark:border-gold/10">
        <ReactionBar noteId={note.id} initialReactions={note.reactions ?? []} />
      </div>

      {isAuthor && (
        <div className="mt-3 flex justify-end">
          {confirmDelete ? (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-ink-soft dark:text-blush/60">
                ¿Eliminar esta notita?
              </span>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-rose-deep underline disabled:opacity-50"
              >
                {deleting ? "Eliminando…" : "Sí, eliminar"}
              </button>

              <button
                onClick={() => setConfirmDelete(false)}
                className="text-ink-soft underline dark:text-blush/50"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-ink-soft underline dark:text-blush/40"
            >
              Eliminar notita
            </button>
          )}
        </div>
      )}
    </div>
  );
}
