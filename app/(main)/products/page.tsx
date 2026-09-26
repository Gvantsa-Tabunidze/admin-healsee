"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ratingFromPurchases,
  useCatalog,
} from "../../../state context/catalog-context";

export default function ProductsPage() {
  const { products, categories } = useCatalog();
  console.log(products, categories);
  
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const filteredProducts =
    categoryFilter === "All categories"
      ? products
      : products.filter((product) => product.category === categoryFilter);
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
            <option>All categories</option>
            {categories.map((category) => (
              <option key={category.id}>{category.title}</option>
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
              <th>Rating</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={`product-thumb thumb-${product.image}`}>
                    {product.image.startsWith("http") ? (
                      <img src={product.image} alt="" />
                    ) : (
                    <span>
                      {product.image === "mat"
                        ? "〰"
                        : product.image === "tee"
                          ? "＋"
                          : product.image === "smoothie"
                            ? "◉"
                            : "✦"}
                    </span>
                    )}
                  </div>
                  <div className="product-name">
                    <strong>{product.title}</strong>
                    <small>{product.vegan ? "Vegan" : "Standard"}</small>
                  </div>
                </td>
                <td>
                  <span className="category-pill">{product.category}</span>
                </td>
                <td>
                  <strong>${product.price.toFixed(2)}</strong>
                  {product.oldPrice && (
                    <del>${product.oldPrice.toFixed(2)}</del>
                  )}
                </td>
                <td>
                  <span className="rating">
                    ★ {ratingFromPurchases(product.purchases).toFixed(1)}
                  </span>
                  <small className="rating-note">
                    {product.purchases} purchases
                  </small>
                </td>
                <td>
                  <span className="status">
                    <i /> Active
                  </span>
                </td>
                <td>
                  <button
                    className="row-menu"
                    aria-label={`Actions for ${product.title}`}
                  >
                    ···
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
