"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCatalog } from "../../../../state context/catalog-context";

export default function NewCategoryPage() {
  const router = useRouter();
  const { addCategory } = useCatalog();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Read the form before any await — currentTarget is null afterwards
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSaving(true);
    setError(null);
    try {
      await addCategory({
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        icon: (formData.get("icon") as string) || "✦",
      });
      form.reset();
      router.push("/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="page-section narrow-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog structure</p>
          <h1>Add category</h1>
          <p className="subheading">
            Create a simple way to group your products.
          </p>
        </div>
        <Link className="secondary-button" href="/categories">
          Cancel
        </Link>
      </div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label className="field full">
            <span>Category title</span>
            <input
              required
              name="title"
              placeholder="e.g. Wellness accessories"
            />
          </label>
          <label className="field">
            <span>Slug</span>
            <input required name="slug" placeholder="wellness-accessories" />
          </label>
          <label className="field">
            <span>Category icon</span>
            <input name="icon" maxLength={2} placeholder="✦" />
          </label>
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="form-actions">
          <Link className="secondary-button" href="/categories">
            Cancel
          </Link>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save category"}
          </button>
        </div>
      </form>
    </section>
  );
}
