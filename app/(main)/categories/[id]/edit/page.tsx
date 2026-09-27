"use client";

import Link from "next/link";
import { use } from "react";
import CategoryForm from "@/components/category-form";
import { useCatalog } from "../../../../../state context/catalog-context";

export default function EditCategoryPage({
  params,
}: PageProps<"/categories/[id]/edit">) {
  const { id } = use(params);
  const { categories, loading, updateCategory } = useCatalog();
  const category = categories.find((item) => item.id === id);

  return (
    <section className="page-section narrow-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog structure</p>
          <h1>Edit category</h1>
          <p className="subheading">
            {category ? category.title : "Update category details."}
          </p>
        </div>
        <Link className="secondary-button" href="/categories">
          Cancel
        </Link>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : category ? (
        <CategoryForm
          key={category.id}
          category={category}
          submitLabel="Save changes"
          onSave={(values) => updateCategory(category.id, values)}
        />
      ) : (
        <p>This category doesn&apos;t exist or was deleted.</p>
      )}
    </section>
  );
}
