'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';


export interface Testimonial {
    _id: string;
    person_image: string;
    person_name: string;
    testimonial_text: string;
}

const cardVariants = {
    hover: {
        y: -10, // Moves the card up by 10 pixels
        transition: {
            duration: 0.2, // Duration of the animation
            ease: "easeInOut" // Type of easing
        }
    }
};

export default function PeopleSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [emblaRef, emblaApi] = useEmblaCarousel({});

    useEffect(() => {
        fetch('/api/testimonials')
            .then(response => response.json())
            .then(data => setTestimonials(data))
            .catch(error => console.error('Error fetching testimonials:', error));
    }, []);

    return (
        <div className="overflow-hidden w-full py-[44px] bg-[#001117] mt-[50px] px-6">
            <div className="w-full items-center flex flex-col !gap-[64px]">
                <h2 className="uppercase main-text-display-font text-[10vw] leading-[100%] text-center">Be a part of the culture</h2>
                <div className="w-[60vw] mx-auto text-center">
                    <p className="text-white text-[24px] font-[500]">
                        Discover our exclusive collection and immerse yourself in the ultimate fashion experience. Each piece is crafted with precision, merging timeless elegance with contemporary trends. Join us on this journey to redefine fashion and make a statement with every outfit.</p>
                </div>
                <div className="" ref={emblaRef}>
                    <div className=" flex gap-[24px]">
                        {testimonials.map((testimonial) => (
                            <motion.div
                                whileHover={'hover'}
                                variants={cardVariants}
                                key={testimonial._id}
                                className=" relative flex flex-col justify-end p-4 !w-[300px] h-[300px] bg-white no-select"
                                style={{
                                    backgroundImage: `url(${testimonial.person_image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="absolute inset-0 bg-black hover:bg-transparent opacity-30"></div>
                                <p className="relative text-white text-[20px]">{testimonial.person_name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .no-select {
                    -webkit-user-select: none; /* Safari */
                    -ms-user-select: none; /* IE 10 and IE 11 */
                    user-select: none; /* Standard syntax */
                }
            `}</style>
        </div>
    );
}
