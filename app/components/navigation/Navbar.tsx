'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation
import { RootState, AppDispatch } from "@/app/redux/store";
import { loadCart, clearCart } from "@/app/redux/cartSlice";
import { useUser } from '@clerk/nextjs';
import CartModal from "../modal/CartModal";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length);
  const { user, isSignedIn } = useUser();
  const pathname = usePathname(); // Use usePathname to get the current path
  const [isCartOpen, setIsCartOpen] = useState(false); // State for modal visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu visibility

  useEffect(() => {
    if (isSignedIn) {
      dispatch(loadCart());
    } else {
      dispatch(clearCart());
    }
  }, [dispatch, isSignedIn]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseModal = () => {
    setIsCartOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full flex items-center justify-between py-4 px-6 absolute z-50 top-0 bg-transparent md:bg-transparent">
      <div>
        <Link href={'/'}><p className="text-logo-main text-white uppercase">Social Cultures</p></Link>
      </div>
      <div className="hidden md:flex gap-8">
        <Link href={'/'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2">Shop</Link>
        <Link href={'/'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2">Lookbook</Link>
      </div>
      <div className="hidden md:flex gap-8">
        {isSignedIn ? (
          <Link href={'/user-profile'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2">
            {user?.fullName || user?.firstName}
          </Link>
        ) : (
          <Link href={'/sign-in'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2">Sign in / Sign up</Link>
        )}
        <button onClick={handleCartClick} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2">
          Cart ({cartItemsCount})
        </button>
      </div>
      <button onClick={handleMenuToggle} className="md:hidden text-white">
        {isMenuOpen ? "Close" : "Menu"}
      </button>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center gap-4 py-4 md:hidden">
          <Link href={'/'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2" onClick={handleMenuToggle}>Shop</Link>
          <Link href={'/'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2" onClick={handleMenuToggle}>Lookbook</Link>
          {isSignedIn ? (
            <Link href={'/user-profile'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2" onClick={handleMenuToggle}>
              {user?.fullName || user?.firstName}
            </Link>
          ) : (
            <Link href={'/sign-in'} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2" onClick={handleMenuToggle}>Sign in / Sign up</Link>
          )}
          <button onClick={handleCartClick} className="uppercase font-medium text-[15px] nav_link text-white px-6 underline tracking-[0.01em] rounded-full py-2">
            Cart ({cartItemsCount})
          </button>
        </div>
      )}
      <CartModal isOpen={isCartOpen} onClose={handleCloseModal} />
    </div>
  );
}
