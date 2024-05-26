'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { useEffect } from 'react';
import { loadCart, incrementItemQuantityInDb, decrementItemQuantityInDb, clearCartInDb } from '../redux/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { CartItem } from '../types/interface';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleCheckout = async () => {
    const { data } = await axios.post('/api/create-checkout-session', {
      items: cartItems,
    });
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };

  const handleIncrement = (product_id: string) => {
    dispatch(incrementItemQuantityInDb(product_id));
  };

  const handleDecrement = (product_id: string) => {
    dispatch(decrementItemQuantityInDb(product_id));
  };

  const handleClearCart = () => {
    dispatch(clearCartInDb());
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price as unknown as number) * item.quantity, 0).toFixed(2);
  };

  return (
    <div>
      <div className="w-full px-6 pt-[20vh] pb-[20vh] bg-[#001117] text-[#e2dfdc] flex flex-col items-center
      ">        <div className="flex flex-row justify-between gap-12 mt-8">

          <div className="h-full flex flex-col items-start gap-6 p-6 border border-[#ffffff4b] rounded-[24px]">
            <h2 className="hnb text-[2.4vw] tracking-tight">Order Summary</h2>
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between gap-6">
                  <span className="hnm text-[1.2vw]">{item.name} x {item.quantity}</span>
                  <span className="hnb text-[1.2vw]">${(item.price as unknown as number * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-4 mt-4 w-full">
                <span className="hnr text-[1.5vw]">Total:</span>
                <span className="hnb text-[1.5vw]">${calculateTotal()}</span>
              </div>
              <div className='w-full flex flex-row justify-between'>
                <button onClick={handleClearCart} className="mt-[24px] rounded-[100px] text-[20px] px-7 py-2 hnr bg-[#001117] text-white">Clear Cart</button>

                <button onClick={handleCheckout} className="mt-[24px]  rounded-[100px] text-[20px] px-7 py-2 hnr bg-[#EB0E0E] text-white">Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
