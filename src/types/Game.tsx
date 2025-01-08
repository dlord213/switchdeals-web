export type Game = {
  title: string;
  description: string;
  details: Record<string, string>;
  images: string[];
  discount: string;
  discountEndDate: string;
  price: string;
  originalPrice: string;
  coverImage?: string;
  eShopLink?: string;
};
