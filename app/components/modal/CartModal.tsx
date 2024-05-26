'use client';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { CartItem } from '@/app/types/interface';
import { clearCartInDb, decrementItemQuantityInDb, incrementItemQuantityInDb, loadCart } from '@/app/redux/cartSlice';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CartModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items as CartItem[]);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overflow-hidden');
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="rounded-[24px] w-[90vw] max-w-md mx-auto relative overflow-y-auto bg-[#001117] text-[#e2dfdc] p-4">
        <div className="w-full px-6 pb-[5vh] pt-[3vh] flex flex-col items-center">
          <div className="flex flex-row justify-between gap-12">
            <div className="h-full flex flex-col items-start gap-6 rounded-[24px]">
              <h2 className="helvetica-bold text-[2.4vw] tracking-tight">Order Summary</h2>
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
                <div className='w-full flex flex-row gap-6'>
                  <button onClick={handleClearCart} className="mt-[24px] rounded-[100px] text-[18px] px-7 py-2 helvetica-bold tracking-[0.02em] bg-[#eb630e] text-white">Clear Cart</button>
                  <button onClick={handleCheckout} className="grow mt-[24px] rounded-[100px] text-[18px] px-7 py-2 helvetica-bold tracking-[0.02em] bg-[#EB0E0E] text-white">Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
