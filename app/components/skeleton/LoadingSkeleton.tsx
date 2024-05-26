// components/custom/LoadingSkeleton.tsx
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-around py-6 items-center">
        <div className="cursor-pointer p-2 text-gray-500 helvetica-medium text-[20px]">
          Loading...
        </div>
      </div>
      <div className="embla">
        <div className="embla__container flex px-6 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="embla__slide w-[500px] p-[26px] bg-[#EEEDE8] rounded-[24px] flex flex-col justify-between items-start gap-8 animate-pulse">
              <div className='flex w-full justify-between items-start'>
                <div className='w-full'>
                  <div className='flex flex-row justify-between w-full items-center'>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className='h-4 bg-gray-300 rounded mt-2 w-1/3'></div>
                </div>
              </div>
              <div className="w-full h-[400px] bg-gray-300 rounded-md"></div>
              <div className='w-full flex flex-row justify-between items-center'>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
