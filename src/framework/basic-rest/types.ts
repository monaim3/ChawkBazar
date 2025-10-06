import { QueryKey } from '@tanstack/react-query';

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  demoVariant?: 'ancient';
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  demoVariant?: 'ancient';
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  id: string | number;
  thumbnail: string;
  original: string;
};

export type Collection = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Brand = {
  id: number | string;
  name: string;
  slug: string;
  image?: Attachment;
  background_image?: any;
  [key: string]: unknown;
};
export type Tag = {
  id: string | number;
  name: string;
  slug: string;
};
export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};
export type Order = {
  id: string | number;
  name: string;
  slug: string;
  products: OrderItem[];
  total: number;
  tracking_number: string;
  customer: {
    id: number;
    email: string;
  };
  shipping_fee: number;
  payment_gateway: string;
};

export type Shop = {
  id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};

// Type for a single carousel item
export interface CarouselItem {
  id: number;
  title: string;
  caption: string | null;
  image: string;
  display_order: number;
}

// Type for the API response
export interface CarouselResponse {
  count: number;
  data: CarouselItem[];
}


// types/category.ts
export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  icon: string | null;
  tags: string[];
  image: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  icon: string | null;
  tags: string[];
  image: string;
  videoUrl: string;
  subCategories: SubCategory[] | null;
}

export interface NewArrival {
  id: number;
  name: string;
  description?: string;
  image: string;
  basePrice: string;
  finalPrice: string;
  category: { id: number; name: string };
  gallery: { image: string; colorCode: string }[];
  variations: {
    colors?: { id: number; colorCode: string; value: string }[];
    sizes?: { id: number; value: string }[];
  };
}


export type Product = {
  id: number;
  name: string;
  description: string | null;
  image: string;
  basePrice: string;
  finalPrice: string;
  category: {
    id: number;
    name: string;
  };
  gallery: {
    image: string;
    colorCode: string;
  }[];
  variations: {
    colors: {
      id: number;
      colorCode: string;
      value: string;
    }[];
    sizes: {
      id: number;
      value: string;
    }[];
  };
  prices: {
    color_id: number;
    color: string;
    color_code: string;
    sizes: {
      size_id: number;
      size: string;
      price: number;
    }[];
  }[];
};


export type ProductResponse = {
  data: Product[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
};

export type QueryOptionsTypes = {
  limit?: number;
  offset?: number;
  [key: string]: any;
};

export interface image {
  id: number
  image: string
}
export interface Allbanner {
  typeId: number;
  type: string;
  images: image[] | null;

}