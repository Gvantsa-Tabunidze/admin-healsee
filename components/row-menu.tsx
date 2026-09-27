"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type RowMenuProps = {
  label: string;
  editHref: string;
  onDelete: () => Promise<void>;
  // Shown in the confirm dialog before deleting
  deleteMessage: string;
};

export default function RowMenu({
  label,
  editHref,
  onDelete,
  deleteMessage,
}: RowMenuProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleDelete = async () => {
    if (!window.confirm(deleteMessage)) return;
    setDeleting(true);
    try {
      await onDelete();
      setOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="row-menu-wrap" ref={wrapRef}>
      <button
        type="button"
        className="row-menu"
        aria-label={`Actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        ···
      </button>
      {open && (
        <div className="row-menu-list" role="menu">
          <Link role="menuitem" href={editHref} onClick={() => setOpen(false)}>
            Edit
          </Link>
          <button
            type="button"
            role="menuitem"
            className="danger"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
