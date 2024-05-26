'use client'

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CartItem, Product } from '@/app/types/interface';
import { addItem, addItemToDbAndStore, updateItemQuantity, updateItemQuantityInDb } from '@/app/redux/cartSlice';
import { RootState } from '@/app/redux/store';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';

const useDispatch = () => useReduxDispatch<AppDispatch>();

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Fetch the cart from the server
    const response = await fetch('/api/cart');
    const cart = await response.json();

    // Check if the product already exists in the cart
    const existingProduct = cart?.find((item: CartItem) => item.product_id === product._id);

    if (existingProduct) {
      // If the product exists, increment its quantity
      await dispatch(updateItemQuantityInDb({ ...existingProduct, quantity: existingProduct.quantity + 1 }));
    } else {
      // If the product does not exist in the cart, add it with a quantity of 1
      await dispatch(addItemToDbAndStore({ _id: product._id, name: product.product_title, price: product.price, product_id: product._id, quantity: 1, product_image: product.image_background}));
    }

    setIsAdding(false);
  };

  return (
    <button 
      onClick={handleAddToCart} 
      className='px-[36px] py-[12px] bg-black text-white paragraph uppercase rounded-full'
      disabled={isAdding}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;
