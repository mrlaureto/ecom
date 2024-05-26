'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { clearCart } from '@/app/redux/cartSlice';
import axios from 'axios';

const SuccessPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const clearCartAfterSuccess = async () => {
      try {
        await axios.post('/api/clear-cart');
        dispatch(clearCart());
        console.log("Cart cleared successfully!");
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    };

    clearCartAfterSuccess();
  }, [dispatch]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
    </div>
  );
};

export default SuccessPage;
