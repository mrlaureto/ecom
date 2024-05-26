// components/custom/ProductCategoriesSkeleton.tsx
import React from 'react';

const ProductCategoriesSkeleton: React.FC = () => {
  return (
    <div className='w-full px-6 mt-[85px]'>
      <div className='w-full flex flex-row justify-between items-center'>
        <div className='h-8 bg-gray-300 rounded w-1/4 animate-pulse'></div>
        <div className='h-6 bg-gray-300 rounded w-1/6 animate-pulse'></div>
        <div className='h-6 bg-gray-300 rounded w-1/5 animate-pulse'></div>
      </div>
      <div className='grid grid-cols-3 w-full gap-[24px] mt-[50px]'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='relative w-full cursor-pointer h-[400px] bg-[#EEEDE8] rounded-[24px] flex flex-col justify-between p-6 animate-pulse'>
            <div>
              <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
              <div className='h-6 bg-gray-300 rounded w-1/2 mb-2'></div>
              <div className='h-4 bg-gray-300 rounded w-1/3'></div>
            </div>
            <div className='flex flex-col'>
              <div className='h-4 bg-gray-300 rounded w-full mb-2'></div>
              <div className='h-4 bg-gray-300 rounded w-2/3'></div>
            </div>
            <div className='text-right'>
              <div className='h-6 bg-gray-300 rounded w-1/6 ml-auto'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoriesSkeleton;
