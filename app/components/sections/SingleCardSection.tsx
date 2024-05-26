'use client';

import { Product } from '@/app/types/interface';
import { gsap } from 'gsap';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { addItemToDbAndStore } from '@/app/redux/cartSlice';

const marqueeDuration = 40; // Match this duration with the product titles scroll speed

const marqueeVariants = {
animate: {
    x: [0, -3000], // Adjust this value based on your needs
    transition: {
        x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: marqueeDuration, // Match the duration
            ease: 'linear',
        },
    },
},
};

export default function SingleCardSection() {
const [products, setProducts] = useState<Product[]>([]);
const [visibleProduct, setVisibleProduct] = useState<Product | null>(null);
const [animateOut, setAnimateOut] = useState<boolean>(false);
const cardRef = useRef<HTMLDivElement>(null);
const observerRef = useRef<IntersectionObserver | null>(null);
const sectionRef = useRef<HTMLDivElement>(null);

const x = useMotionValue(0);
const y = useMotionValue(0);

const rotateX = useTransform(y, [-200, 200], [15, -15]);
const rotateY = useTransform(x, [-200, 200], [-15, 15]);

const dispatch = useDispatch<AppDispatch>();

useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const newX = clientX - rect.left - rect.width / 2;
            const newY = clientY - rect.top - rect.height / 2;
            x.set(newX);
            y.set(newY);
        }
    };

    const card = cardRef.current;
    if (card) {
        card.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
        if (card) {
            card.removeEventListener('mousemove', handleMouseMove);
        }
    };
}, [x, y]);

useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    fetchProducts();
}, []);

useEffect(() => {
    if (animateOut) {
        const card = cardRef.current;

        gsap.to(card, {
            x: 300,
            skewX: 30,
            opacity: 0,
            duration: 1,
            ease: 'expo.in',
            onComplete: () => {
                setAnimateOut(false); // Reset the state
            },
        });
    } else {
        const card = cardRef.current;

        gsap.fromTo(card,
            { x: -600, skewX: 30, opacity: 0 },
            { x: 0, skewX: 0, opacity: 1, duration: 1, ease: 'expo.out' }
        );
    }
}, [visibleProduct, animateOut]);

useEffect(() => {
    if (observerRef.current) {
        observerRef.current.disconnect();
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setAnimateOut(true);
                setTimeout(() => {
                    const productTitle = entry.target.textContent || "Product title here";
                    const product = products.find(p => p.product_title === productTitle);
                    setVisibleProduct(product || null);
                }, 1000); // Ensure this matches the duration of the exit animation
            }
        });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
        threshold: 0.6,
        root: sectionRef.current,
        rootMargin: '-30% 0px',
    });

    const movingTexts = document.querySelectorAll('.moving-text-diagonal');
    movingTexts.forEach(text => observerRef.current!.observe(text));

    return () => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
    };
}, [products]);

const handleAddToCart = (product: Product | null) => {
    if (product) {
        dispatch(addItemToDbAndStore({
            _id: product._id,
            product_id: product._id,
            name: product.product_title,
            price: product.price,
            quantity: 1,
            product_image: product.image_background
        }));
    }
};


const repeatedProducts = [...products, ...products, ...products]; // Repeat the products to ensure a smooth loop

return (
    <div ref={sectionRef} className="w-full h-[100vh] py-8 flex flex-col justify-between">
        <div className="overflow-hidden">
            <motion.div
                className="flex flex-row gap-[64px] whitespace-nowrap"
                variants={marqueeVariants}
                animate="animate"
            >
                {repeatedProducts.map((product, index) => (
                    <div
                        className="flex flex-row gap-[44px]"
                        key={index}
                    >
                        <p className="text-[#AAA69E] moving-text-diagonal text-[18px]">{product.product_title}</p>
                        <img src="./star.png" alt="" width={20} height={15} className="object-contain" />
                    </div>
                ))}
            </motion.div>
        </div>
        <div className="grow overflow-hidden flex flex-col justify-center">
            <div className="relative h-full">
                <div className='h-full w-full flex flex-col justify-center items-center relative z-20'>
                    <motion.div
                        ref={cardRef}
                        className="tilt-card w-[300px] sm:w-[400px] bg-[#ebebe7] rounded-[24px] p-6"
                        style={{
                            rotateX: rotateX,
                            rotateY: rotateY,
                            perspective: '1000px',
                        }}
                        key={visibleProduct ? visibleProduct._id : 'default'} // Key is necessary to trigger re-render
                        whileHover={{
                            scale: 1.05,
                            transition: {
                                duration: 0.3,
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        <div className="w-full h-full">
                            <div className="relative flex flex-col h-full w-full items-start justify-between">
                                <img src="./star-large.png" alt="" className="absolute top-[-60px] right-[-60px] rotating-star" />
                                <h2 className="tracking-tight helvetica-bold font-[700] text-[32px] text-[#333333]">
                                    {visibleProduct ? visibleProduct.product_title : 'Product title here'}
                                </h2>
                                <h4 className="helvetica-medium text-[18px] text-[#383838a2] font-[500]">
                                    {visibleProduct ? visibleProduct.description : 'The stuff you\'re born for.'}
                                </h4>
                                <img src={visibleProduct?.image_background} alt="" className="h-[20rem] mb-[24px] w-full object-contain" />
                                <div className="flex flex-row w-full justify-between">
                                    <p className="text-[#333333] font-[600] text-[24px]">
                                        {visibleProduct ? `$${visibleProduct.price}` : ''}
                                    </p>
                                    <p 
                                    className="text-[#333333] font-[600] text-[24px] cursor-pointer"
                                    onClick={() => handleAddToCart(visibleProduct)}
                                >
                                    Add to cart
                                </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-[40%] left-0 w-full transform rotate-[15deg]">
                    <motion.div
                        className="flex flex-row gap-[44px] bg-[#EB0E0E] whitespace-nowrap"
                        variants={marqueeVariants}
                        animate="animate"
                        style={{ width: '5000px' }} // Set a large width for the motion div
                    >
                        {products.concat(products).map((product, index) => (
                            <p className="text-white main-text-display-font uppercase tracking-tighter text-[20vw] sm:text-[6vw] moving-text-diagonal" key={index}>
                                {product.product_title}
                            </p>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
        <div className="overflow-hidden">
            <motion.div
                className="flex flex-row gap-[64px] whitespace-nowrap"
                variants={marqueeVariants}
                animate="animate"
            >
                {repeatedProducts.map((product, index) => (
                    <div
                        className="flex flex-row gap-[44px]"
                        key={index}
                    >
                        <p className="text-[#AAA69E] moving-text text-[18px]">{product.product_title}</p>
                        <img src="./star.png" alt="" width={20} height={15} className="object-contain" />
                    </div>
                ))}
            </motion.div>
        </div>
        <style jsx global>{`
.rotating-star {
    animation: rotate 20s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
`}</style>

    </div>
);
}

