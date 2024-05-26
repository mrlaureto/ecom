// components/custom/ProductsSlider.tsx
'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { addItemToDbAndStore, loadCart } from '@/app/redux/cartSlice';
import { useUser } from '@clerk/nextjs';
import { Category, Product } from '@/app/types/interface';
import { motion } from 'framer-motion';
import LoadingSkeleton from '../skeleton/LoadingSkeleton';
import 'tailwindcss/tailwind.css';

interface ProductsSliderProps {
  categories: Category[];
  products: Product[];
}

const cardVariants = {
  hover: {
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const ProductsSlider: React.FC<ProductsSliderProps> = ({ categories, products }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isSignedIn } = useUser();
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [emblaRef] = useEmblaCarousel({ align: 'start' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories]);

  useEffect(() => {
    if (categories.length > 0 && products.length > 0) {
      setIsLoading(false);
    }
  }, [categories, products]);

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(product => product.category_id === categoryId).length;
  };

  const filteredProducts = products.filter(product => product.category_id === selectedCategory);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleAddToCart = (product: Product | null) => {
    if (product) {
      dispatch(addItemToDbAndStore({
        _id: product._id,
        product_id: product._id,
        name: product.product_title,
        price: product.price,
        quantity: 1,
        product_image: product.image_background
      }));
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-around py-6 items-center overflow-x-auto scrollbar-hide">
        {categories.map((category, index) => (
          <React.Fragment key={category._id}>
            <div
              className={`cursor-pointer p-2 ${category._id === selectedCategory ? 'text-red-500' : 'text-gray-500'} helvetica-medium text-[20px] whitespace-nowrap`}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.category_name}<sup>({getCategoryProductCount(category._id)})</sup>
            </div>
            {index < categories.length - 1 && (
              <span className="text-gray-500"> /  </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex px-6 mt-6 md:mt-2 gap-6">
          {filteredProducts.map(product => (
            <motion.div 
              whileHover="hover" 
              variants={cardVariants} 
              key={product._id} 
              className="embla__slide w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-[26px] bg-[#EEEDE8] rounded-[24px] flex flex-col justify-between items-start gap-8"
            >
              <div className='flex w-full justify-between items-start'>
                <div className='w-full'>
                  <div className='flex flex-row justify-between w-full items-center'>
                    <h2 className="tracking-tight helvetica-bold font-[700] text-[32px] text-[#333333]">{product.product_title}</h2>
                  </div>
                  <h4 className='helvetica-medium text-[18px] text-[#383838a2] font-[500]'>The stuff you're born for.</h4>
                </div>
              </div>
              <img src={product.image_background} alt={product.product_title} className="w-full h-[200px] md:h-[400px] object-contain rounded-md" />
              <div className='w-full flex flex-row justify-between items-center'>
                <p className='helvetica-bold uppercase text-[18px] text-[#4d473deb] hover:text-[#FF0000] cursor-pointer' onClick={() => handleAddToCart(product)}>Add to cart</p>
                <p className="helvetica-bold text-[18px] font-[600] rounded-full text-[#4d473deb]">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSlider;
