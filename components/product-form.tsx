"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IProduct, NewProduct } from "@/interfaces/types";
import { uploadImage } from "@/lib/cloudinary/cloudinary";
import { useCatalog } from "../state context/catalog-context";

type ProductFormProps = {
  // When set, the form is pre-filled for editing
  product?: IProduct;
  submitLabel: string;
  onSave: (values: NewProduct) => Promise<unknown>;
};

export default function ProductForm({
  product,
  submitLabel,
  onSave,
}: ProductFormProps) {
  const router = useRouter();
  const { categories } = useCatalog();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Read the form before any await — currentTarget is null afterwards
    const form = event.currentTarget;
    const formData = new FormData(form);
    const oldPrice = formData.get("old_price") as string;
    const imageFile = formData.get("image") as File | null;

    setSaving(true);
    setError(null);
    try {
      // Keep the current image unless a new file was chosen
      const image =
        imageFile && imageFile.size > 0
          ? await uploadImage(imageFile)
          : (product?.image ?? null);
      await onSave({
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || null,
        category_id: (formData.get("category_id") as string) || null,
        price: Number(formData.get("price")),
        old_price: oldPrice ? Number(oldPrice) : null,
        image,
        vegan: formData.get("vegan") === "on",
      });
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setSaving(false);
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <label className="field full">
          <span>Product title</span>
          <input
            required
            name="title"
            defaultValue={product?.title}
            placeholder="e.g. Daily greens bowl"
          />
        </label>
        <label className="field full">
          <span>Description</span>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            placeholder="Tell customers what makes this product special"
            rows={4}
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select
            required
            name="category_id"
            defaultValue={product?.category_id ?? ""}
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>
            Product image {product?.image && <em>Leave empty to keep current</em>}
          </span>
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
            defaultValue={product?.price}
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
            name="old_price"
            type="number"
            defaultValue={product?.old_price ?? ""}
            placeholder="0.00"
          />
        </label>
      </div>
      <label className="check-field">
        <input
          name="vegan"
          type="checkbox"
          defaultChecked={product?.vegan ?? false}
        />
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
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
