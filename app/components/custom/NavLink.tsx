'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NavLinkProps {
  primaryText: string;
  secondaryText: string;
  href: string;
}

const NavLink: React.FC<NavLinkProps> = ({ primaryText, secondaryText, href }) => {
  return (
    <motion.a
      href={href}
      className="relative block h-10 overflow-hidden text-white uppercase tracking-[0.02em]"
      whileHover="hidden"
    >
      <motion.div
        initial="visible"
        whileHover="hidden"
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' }
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {primaryText}
      </motion.div>
      <motion.div
        initial="hidden"
        whileHover="visible"
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          visible: { y: 0 },
          hidden: { y: '100%' }
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        [{secondaryText}]
      </motion.div>
    </motion.a>
  );
};

export default NavLink;
