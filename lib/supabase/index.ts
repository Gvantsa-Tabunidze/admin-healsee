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

export const supabaseService = {
  async getCategories(): Promise<ICategory[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id");

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
    categoryId: number,
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

  async deleteCategory(categoryId: number): Promise<void> {
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
      .select("*")
      .order("id");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getProduct(productId: number): Promise<IProduct> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
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
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateProduct(
    productId: number,
    updatedProduct: ProductUpdate,
  ): Promise<IProduct> {
    const { data, error } = await supabase
      .from("products")
      .update(updatedProduct)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteProduct(productId: number): Promise<void> {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
