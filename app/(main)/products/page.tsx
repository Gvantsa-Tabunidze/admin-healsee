"use client";

import Link from "next/link";
import { useState } from "react";
import RowMenu from "@/components/row-menu";
import { useCatalog } from "../../../state context/catalog-context";

export default function ProductsPage() {
  const { products, categories, deleteProduct } = useCatalog();
  console.log(products, categories);

  // "" = all categories, otherwise a category id
  const [categoryFilter, setCategoryFilter] = useState("");
  const filteredProducts = categoryFilter
    ? products.filter((product) => product.category_id === categoryFilter)
    : products;
  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Products</h1>
          <p className="subheading">Manage the goods available in your shop.</p>
        </div>
        <Link className="primary-button" href="/products/new">
          ＋ Add product
        </Link>
      </div>
      <div className="toolbar">
        <label className="select-wrap">
          <span>Category</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <span className="result-count">{filteredProducts.length} products</span>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-thumb">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt="" />
                    ) : (
                      <span>✦</span>
                    )}
                  </div>
                  <div className="product-name">
                    <strong>{product.title}</strong>
                    <small>{product.vegan ? "Vegan" : "Standard"}</small>
                  </div>
                </td>
                <td>
                  <span className="category-pill">
                    {product.category?.title ?? "Uncategorized"}
                  </span>
                </td>
                <td>
                  <strong>${product.price.toFixed(2)}</strong>
                  {product.old_price != null && (
                    <del>${product.old_price.toFixed(2)}</del>
                  )}
                </td>
                <td>
                  <span className="status">
                    <i /> Active
                  </span>
                </td>
                <td>
                  <RowMenu
                    label={product.title}
                    editHref={`/products/${product.id}/edit`}
                    deleteMessage={`Delete "${product.title}"? This can't be undone.`}
                    onDelete={() => deleteProduct(product.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
