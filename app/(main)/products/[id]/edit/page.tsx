"use client";

import Link from "next/link";
import { use } from "react";
import ProductForm from "@/components/product-form";
import { useCatalog } from "../../../../../state context/catalog-context";

export default function EditProductPage({
  params,
}: PageProps<"/products/[id]/edit">) {
  const { id } = use(params);
  const { products, loading, updateProduct } = useCatalog();
  const product = products.find((item) => item.id === id);

  return (
    <section className="page-section narrow-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Edit product</h1>
          <p className="subheading">
            {product ? product.title : "Update product details."}
          </p>
        </div>
        <Link className="secondary-button" href="/products">
          Cancel
        </Link>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : product ? (
        <ProductForm
          // Remount if the product changes so default values refresh
          key={product.id}
          product={product}
          submitLabel="Save changes"
          onSave={(values) => updateProduct(product.id, values)}
        />
      ) : (
        <p>This product doesn&apos;t exist or was deleted.</p>
      )}
    </section>
  );
}
