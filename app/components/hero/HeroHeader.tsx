'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HeroHeader() {
    const headingText = "SocialCultures";

    const animation = {
        hidden: { y: '100%' }, // Start below the container
        visible: {
            y: '0%',
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="flex flex-col pb-[2rem] items-center justify-end w-full h-[100vh] overflow-hidden" style={{ backgroundImage: `url(https://res.cloudinary.com/dvyyo8w7k/image/upload/v1716297671/lawless-capture-da4Fe6ePNmk-unsplash_1_jyz5nt.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex flex-col items-center overflow-hidden">
                <p className="hnr uppercase text-white tracking-[0.02em] mb-[-24px]">EST 2024</p>
                <div className="overflow-hidden w-[100vw] flex !items-center mb-[-24px]" style={{height: '25vw', display: 'flex', alignItems: 'center' }}> {/* Set height to match text size */}
                    <motion.div
                        className="mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={animation}
                    >
                        <h1 className='text-white text-[18vw] main-text-display-font '>{headingText}</h1>
                    </motion.div>
                </div>
                <div className="">
                    <p className="uppercase text-white tracking-[0.02em]">Just a simple online store made by Godwin. NextJS x React x MongoDB</p>
                </div>
            </div>
        </div>
    );
}
