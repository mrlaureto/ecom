// types.ts
export interface Span {
  col?: number;
  row?: number;
}

export interface Category {
  _id: string;    
  category_name: string;
  category_pill_image: string;
  category_background_image: string;
  color: string;
  items_count: number;
  // Add other properties as needed
}

export interface Product {
  _id: string;
  product_title: string;
  description: string;
  image_background: string;
  price: string;
  category_id: string;
  // add more properties here as needed
}

export interface CartItem {
  _id: string;
  name: string;
  price: string;
  product_id: string;
  product_image: string;
  quantity: number;
}

export interface Testimonial {
  _id: string;
  person_image: string;
  person_name: string;
  testimonial_text: string;
}
