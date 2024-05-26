'use client';

import Link from "next/link";
import { Category, Product } from "@/app/types/interface";
import { useState, useEffect } from 'react';
import ProductCategoriesSkeleton from "../skeleton/ProductCategoriesSkeleton";

interface ProductCategoriesProps {
  categories: Category[];
  products: Product[];
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ categories, products }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categories.length > 0 && products.length > 0) {
      setIsLoading(false);
    }
  }, [categories, products]);

  if (isLoading) {
    return <ProductCategoriesSkeleton />;
  }

  return (
    <div className='w-full px-6 mt-[85px]'>
      <div className='w-full flex flex-col md:flex-row justify-between items-center'>
        <h2 className='tracking-tight helvetica-bold font-[700] text-[32px] text-[#333333] mb-4 md:mb-0'>Shop popular brands</h2>
        <p className='text-[20px] tracking-tight font-[500]'>Niko // Abbibis // Shine // McDid</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-full gap-[24px] mt-[50px]'>
        {categories.map((category, index) => (
          <div key={category._id} className='relative w-full h-[300px] sm:h-[350px] md:h-[400px] bg-[#EEEDE8] rounded-[24px] flex flex-col justify-between p-6 transition-colors duration-300 group hover:bg-[#EB0E0E]'>
            <div>
              <p className='text-[14px] text-gray-700 helvetica-regular group-hover:text-white'>{String(index + 1).padStart(2, '0')}</p>
              <h2 className='tracking-tight helvetica-bold font-[700] text-[24px] sm:text-[28px] md:text-[32px] text-[#333333] group-hover:text-white'>{category.category_name}</h2>
              <p className='text-[16px] sm:text-[18px] text-gray-600 helvetica-regular group-hover:text-white'>
                {products.filter(product => product.category_id === category._id).length} Items
              </p>
            </div>
            <div className='flex flex-col'>
              <p className='helvetica-medium text-[16px] sm:text-[18px] text-[#5c5b58] font-[500] group-hover:text-white'>
                Effortless cool through the use of traditional artisanal techniques, hand-loomed fabrics, and quality of design.
              </p>
            </div>
            <p className='absolute top-[50px] right-1 text-gray-700 transform rotate-90 group-hover:text-white'>BRANDS</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
