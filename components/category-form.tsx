"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ICategory, NewCategory } from "@/interfaces/types";

type CategoryFormProps = {
  // When set, the form is pre-filled for editing
  category?: ICategory;
  submitLabel: string;
  onSave: (values: NewCategory) => Promise<unknown>;
};

export default function CategoryForm({
  category,
  submitLabel,
  onSave,
}: CategoryFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setSaving(true);
    setError(null);
    try {
      await onSave({
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
      });
      router.push("/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
      setSaving(false);
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <label className="field full">
          <span>Category title</span>
          <input
            required
            name="title"
            defaultValue={category?.title}
            placeholder="e.g. Wellness accessories"
          />
        </label>
        <label className="field full">
          <span>Slug</span>
          <input
            required
            name="slug"
            defaultValue={category?.slug}
            placeholder="wellness-accessories"
          />
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="form-actions">
        <Link className="secondary-button" href="/categories">
          Cancel
        </Link>
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
