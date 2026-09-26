"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { uploadImage } from "@/lib/cloudinary/cloudinary";
import { useCatalog } from "../../../../state context/catalog-context";

export default function NewProductPage() {
  const router = useRouter();
  const { categories, addProduct } = useCatalog();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Read the form before any await — currentTarget is null afterwards
    const form = event.currentTarget;
    const formData = new FormData(form);
    const oldPrice = formData.get("oldPrice") as string;
    const imageFile = formData.get("image") as File | null;

    setSaving(true);
    setError(null);
    try {
      const image =
        imageFile && imageFile.size > 0
          ? await uploadImage(imageFile)
          : "";
      await addProduct({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) ?? "",
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        image,
        vegan: formData.get("vegan") === "on",
        purchases: 0,
      });
      form.reset();
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="page-section narrow-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Add product</h1>
          <p className="subheading">Create a product for your healsee shop.</p>
        </div>
        <Link className="secondary-button" href="/products">
          Cancel
        </Link>
      </div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label className="field full">
            <span>Product title</span>
            <input required name="title" placeholder="e.g. Daily greens bowl" />
          </label>
          <label className="field full">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Tell customers what makes this product special"
              rows={4}
            />
          </label>
          <label className="field">
            <span>Category</span>
            <select required name="category">
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category.id}>{category.title}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Product image</span>
            <input name="image" type="file" accept="image/*" />
          </label>
          <label className="field">
            <span>
              New price <em>USD</em>
            </span>
            <input
              required
              min="0"
              step="0.01"
              name="price"
              type="number"
              placeholder="0.00"
            />
          </label>
          <label className="field">
            <span>
              Old price <em>Optional</em>
            </span>
            <input
              min="0"
              step="0.01"
              name="oldPrice"
              type="number"
              placeholder="0.00"
            />
          </label>
        </div>
        <label className="check-field">
          <input name="vegan" type="checkbox" />
          <span>
            <strong>Vegan product</strong>
            <small>Show the vegan label on this product</small>
          </span>
        </label>
        <div className="rating-explainer">
          <span>★</span>
          <div>
            <strong>Rating is calculated automatically</strong>
            <p>
              Product ranking will use purchase frequency and customer feedback
              once your shop is connected.
            </p>
          </div>
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="form-actions">
          <Link className="secondary-button" href="/products">
            Cancel
          </Link>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </form>
    </section>
  );
}
