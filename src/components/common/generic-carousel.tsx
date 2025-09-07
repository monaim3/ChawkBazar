"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUI } from "@contexts/ui.context";
import type { Product } from "@framework/types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import Loading from "./Loading";

/** ---------- Types ---------- */
export type GenericProduct = {
    id: number | string;
    name: string;
    description?: string;
    image: string;
    basePrice?: string | number;
    finalPrice?: string | number;
    category?: { id: number | string; name: string };
    gallery?: { image: string; colorCode: string }[];
    variations?: {
        colors?: { id: number | string; colorCode: string; value: string }[];
        sizes?: { id: number | string; value: string }[];
    };
};

/** ---------- Helpers ---------- */
const parsePrice = (v: string | number | undefined): number => {
    if (typeof v === "number") return v;
    if (!v) return 0;
    const first = String(v).split("-")[0].trim();
    const num = Number(first.replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? num : 0;
};

/** ---------- Styled Product Card ---------- */
const StyledProductCard = ({ product }: { product: GenericProduct }) => {
    const { setModalData, setModalView, openModal } = useUI();

    const basePrice = parsePrice(product.basePrice);
    const finalPrice = parsePrice(product.finalPrice);
    const hasDiscount = finalPrice > 0 && finalPrice < basePrice;
    const displayPrice = finalPrice > 0 ? finalPrice : basePrice;
    const originalPrice = hasDiscount ? basePrice : null;
    const discountPercentage = originalPrice && displayPrice
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0;

    const openQuickView = () => {
        console.log("product", product);
        setModalData({ data: product as unknown as Product });
        setModalView("PRODUCT_VIEW");
        openModal();
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.category && (
                    <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {product.category.name}
                    </div>
                )}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{discountPercentage}%
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openQuickView();
                    }}
                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-900 transition-colors duration-300"
                >
                    Add To Cart
                </button>
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-semibold">0.0</span>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <AiOutlineStar key={i} size={12} className="text-gray-300" />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">| 0.0</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2 leading-5">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        TK. {displayPrice}
                    </span>
                    {originalPrice && (
                        <span className="text-sm font-semibold text-gray-500 line-through">
                            TK. {originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/** ---------- Generic Carousel Component ---------- */
type CarouselProps = {
    title?: string;
    viewAllLink?: string;
    fetcher: () => Promise<GenericProduct[]>;
    slidesPerView?: { [key: number]: number };
    loop?: boolean;
    autoplayDelay?: number;
};

export const GenericCarousel = ({
    title = "Products",
    viewAllLink,
    fetcher,
    slidesPerView = { 480: 2, 768: 3, 1024: 4 },
    loop = true,
    autoplayDelay = 8000,
}: CarouselProps) => {
    const { data: products = [], isLoading, error } = useQuery({
        queryKey: [title],
        queryFn: fetcher,
    });

    if (isLoading) return <Loading></Loading>

    const swiperBreakpoints = Object.fromEntries(
        Object.entries(slidesPerView).map(([width, slides]) => [
            width,
            { slidesPerView: slides },
        ])
    );
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex-1 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {title}
                        </h2>
                        <div className="w-32 h-0.5 bg-gray-800 mx-auto"></div>
                    </div>
                    {viewAllLink && (
                        <Link href={viewAllLink} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            View All
                        </Link>
                    )}
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        loop={loop}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={swiperBreakpoints}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <StyledProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                        aria-label="Previous products"
                    >
                        <IoChevronBack size={20} className="text-gray-600" />
                    </button>

                    <button
                        className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                        aria-label="Next products"
                    >
                        <IoChevronForward size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </section>
    );
};
