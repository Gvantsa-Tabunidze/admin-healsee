"use client";

import Link from "next/link";
import CategoryForm from "@/components/category-form";
import { useCatalog } from "../../../../state context/catalog-context";

export default function NewCategoryPage() {
  const { addCategory } = useCatalog();
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
      <CategoryForm submitLabel="Save category" onSave={addCategory} />
    </section>
  );
}
