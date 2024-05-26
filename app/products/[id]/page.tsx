import { Product } from '@/app/types/interface';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/app/components/ecom/AddToCart';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import Providers from '@/app/redux/provider';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  // Use environment variable for the API base URL
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error('Failed to fetch product data');
    }

    const product: Product = await res.json();

    return (
      <Providers> {/* Wrap with Provider and provide Redux store */}
        <div className='w-full flex flex-col gap-6 justify-center !items-center py-11 px-11'>
         <div className='flex flex-col gap-[24px] !items-center'>
         <div className='flex flex-col gap-2 !items-center'>
          
         <h1 className='paragraph text-[36px]'>{product.product_title}</h1>
         
          {product.description ? <p>{product.description}</p> : <p>This is just a description placeholder for the actual product!</p>}
          <div className='mt-[12px] w-[500px] h-[300px] bg-red-100 rounded-[24px]' style={{backgroundImage: `url(${product.image_background})`, backgroundSize: 'cover'}}>
          
          </div>
         </div>
          
          <div className='flex gap-[24px] items-center'>
          <p className='paragraph text-[18px] tracking-[0.01em]'>{product.price}</p>
          <AddToCartButton product={product} />
          </div>
          </div>
        </div>
      </Providers>
    );
  } catch (error) {
    notFound(); // Handle the 404 case or other errors
    return null; // Return null to avoid rendering anything in case of error
  }
}
