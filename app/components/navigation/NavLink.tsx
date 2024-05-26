'use client';

import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  primaryText: string;
  secondaryText: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, primaryText, secondaryText }) => {
  return (
    <div className="relative h-10 overflow-hidden group">
      <Link href={href} className="block h-full">
        <div className="absolute inset-0 flex items-center justify-center text-white uppercase tracking-[0.02em] transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
          {primaryText}
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white uppercase tracking-[0.02em] transition-transform duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          [{secondaryText}]
        </div>
      </Link>
    </div>
  );
};

export default NavLink;
