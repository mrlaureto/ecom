'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'swiper/swiper-bundle.css';

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from 'lucide-react';
import { Category, Product } from './types/interface';
import HeroHeader from './components/hero/HeroHeader';
import ProductsSlider from './components/custom/ProductsSlider';
import ProductCategories from './components/custom/ProductCategories';
import PeopleSection from './components/sections/PeopleSection';
import SingleCardSection from './components/sections/SingleCardSection';


const text = "The defining new collection from everyone's favorite half-masked creator is out now for a limited release. Presenting, the SOCIALCULTURE.";

// then use it in your state definition

interface Error {
  message: string;
}

const fetchCategoriesAndProducts = async (): Promise<{ categories: Category[], products: Product[] }> => {
  const response = await fetch('/api/categories-and-products');
  const data = await response.json();
  return data;
};

export default function Page() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    (async () => {
      const { categories, products } = await fetchCategoriesAndProducts();
      setCategories(categories);
      setProducts(products);
    })();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col relative">
        <HeroHeader />
        <ProductsSlider categories={categories} products={products} />
        <ProductCategories categories={categories} products={products} />
        <PeopleSection />
        <SingleCardSection />
        <div>
        </div>
      </div>
    </div>
  );
}
