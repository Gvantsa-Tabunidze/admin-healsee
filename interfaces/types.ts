export type ICategory = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

export type IProduct = {
  id: string; 
  title: string;
  description: string | null;
  category_id: string | null; 
  category: Pick<ICategory, "id" | "title"> | null;
  price: number;
  old_price: number | null;
  image: string | null;
  vegan?: boolean | null;
  created_at: string;
};


export type NewProduct = Omit<IProduct, "id" | "category" | "created_at">;
export type ProductUpdate = Partial<NewProduct>;
export type NewCategory = Omit<ICategory, "id" | "created_at">;
export type CategoryUpdate = Partial<NewCategory>;
