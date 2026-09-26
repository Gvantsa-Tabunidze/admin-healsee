export type IProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  oldPrice: number | null;
  image: string;
  vegan: boolean;
  purchases: number;
};
export type ICategory = {
  id: number;
  title: string;
  slug: string;
  icon: string;
};


export type NewProduct = Omit<IProduct, "id">;
export type ProductUpdate = Partial<NewProduct>;
export type NewCategory = Omit<ICategory, "id">;
export type CategoryUpdate = Partial<NewCategory>;
