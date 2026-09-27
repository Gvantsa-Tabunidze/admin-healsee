"use client";

import Link from "next/link";
import ProductForm from "@/components/product-form";
import { useCatalog } from "../../../../state context/catalog-context";

export default function NewProductPage() {
  const { addProduct } = useCatalog();
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
      <ProductForm submitLabel="Save product" onSave={addProduct} />
    </section>
  );
}
