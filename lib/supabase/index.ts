import {
  CategoryUpdate,
  ICategory,
  IProduct,
  NewCategory,
  NewProduct,
  ProductUpdate,
} from "@/interfaces/types";
import { createSupabaseClient } from "./client";

const supabase = createSupabaseClient();

// Product columns plus the joined category (via products.category_id)
const PRODUCT_SELECT = "*, category:categories(id, title)";

export const supabaseService = {
  async getCategories(): Promise<ICategory[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createCategory(category: NewCategory): Promise<ICategory> {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateCategory(
    categoryId: string,
    updatedCategory: CategoryUpdate,
  ): Promise<ICategory> {
    const { data, error } = await supabase
      .from("categories")
      .update(updatedCategory)
      .eq("id", categoryId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Products are kept: they're detached (category_id = null) before the delete.
  // The FK should also be ON DELETE SET NULL so the database enforces this.
  async deleteCategory(categoryId: string): Promise<void> {
    const { error: detachError } = await supabase
      .from("products")
      .update({ category_id: null })
      .eq("category_id", categoryId);

    if (detachError) {
      throw new Error(detachError.message);
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      throw new Error(error.message);
    }
  },

  async getProducts(): Promise<IProduct[]> {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getProduct(productId: string): Promise<IProduct> {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("id", productId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createProduct(product: NewProduct): Promise<IProduct> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select(PRODUCT_SELECT)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateProduct(
    productId: string,
    updatedProduct: ProductUpdate,
  ): Promise<IProduct> {
    const { data, error } = await supabase
      .from("products")
      .update(updatedProduct)
      .eq("id", productId)
      .select(PRODUCT_SELECT)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteProduct(productId: string): Promise<void> {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
