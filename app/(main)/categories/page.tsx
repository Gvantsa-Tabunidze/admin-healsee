"use client";

import Link from "next/link";
import { useCatalog } from "../../../state context/catalog-context";

export default function CategoriesPage() {
  const { categories, products } = useCatalog();
  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog structure</p>
          <h1>Categories</h1>
          <p className="subheading">
            Keep products easy to discover and filter.
          </p>
        </div>
        <Link className="primary-button" href="/categories/new">
          ＋ Add category
        </Link>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <div className="category-icon">{category.icon}</div>
            <div>
              <h3>{category.title}</h3>
              <p>/{category.slug}</p>
            </div>
            <span className="category-products">
              {
                products.filter(
                  (product) => product.category === category.title,
                ).length
              }{" "}
              products
            </span>
            <button
              className="row-menu"
              aria-label={`Actions for ${category.title}`}
            >
              ···
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
