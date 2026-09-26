"use client";

import {
  CategoryUpdate,
  ICategory,
  IProduct,
  NewCategory,
  NewProduct,
  ProductUpdate,
} from "@/interfaces/types";
import { supabaseService } from "@/lib/supabase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CatalogContextValue = {
  products: IProduct[];
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  getProducts: () => Promise<IProduct[]>;
  getSingleProduct: (productId: number) => Promise<IProduct>;
  addProduct: (product: NewProduct) => Promise<IProduct>;
  updateProduct: (
    productId: number,
    updatedProduct: ProductUpdate,
  ) => Promise<IProduct>;
  deleteProduct: (productId: number) => Promise<void>;
  getCategories: () => Promise<ICategory[]>;
  addCategory: (category: NewCategory) => Promise<ICategory>;
  updateCategory: (
    categoryId: number,
    updatedCategory: CategoryUpdate,
  ) => Promise<ICategory>;
  deleteCategory: (categoryId: number) => Promise<void>;
};
const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Products
  const getProducts = useCallback(async () => {
    const data = await supabaseService.getProducts();
    setProducts(data);
    return data;
  }, []);

  const getSingleProduct = useCallback(
    (productId: number) => supabaseService.getProduct(productId),
    [],
  );

  const addProduct = useCallback(async (product: NewProduct) => {
    const created = await supabaseService.createProduct(product);
    setProducts((prev) => [...prev, created]);
    return created;
  }, []);

  const updateProduct = useCallback(
    async (productId: number, updatedProduct: ProductUpdate) => {
      const updated = await supabaseService.updateProduct(
        productId,
        updatedProduct,
      );
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? updated : product)),
      );
      return updated;
    },
    [],
  );

  const deleteProduct = useCallback(async (productId: number) => {
    await supabaseService.deleteProduct(productId);
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  // Categories
  const getCategories = useCallback(async () => {
    const data = await supabaseService.getCategories();
    setCategories(data);
    return data;
  }, []);

  const addCategory = useCallback(async (category: NewCategory) => {
    const created = await supabaseService.createCategory(category);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(
    async (categoryId: number, updatedCategory: CategoryUpdate) => {
      const updated = await supabaseService.updateCategory(
        categoryId,
        updatedCategory,
      );
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId ? updated : category,
        ),
      );
      return updated;
    },
    [],
  );

  const deleteCategory = useCallback(async (categoryId: number) => {
    await supabaseService.deleteCategory(categoryId);
    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId),
    );
  }, []);

  // Initial load
  useEffect(() => {
    let ignore = false;
    Promise.all([supabaseService.getProducts(), supabaseService.getCategories()])
      .then(([productData, categoryData]) => {
        if (ignore) return;
        setProducts(productData);
        setCategories(categoryData);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Failed to load catalog");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      categories,
      loading,
      error,
      getProducts,
      getSingleProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      getCategories,
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      products,
      categories,
      loading,
      error,
      getProducts,
      getSingleProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      getCategories,
      addCategory,
      updateCategory,
      deleteCategory,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}
export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context)
    throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}
export function ratingFromPurchases(purchases: number) {
  return Math.min(5, 3.6 + purchases / 100);
}
