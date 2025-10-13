"use client";

import { useProductsQuery } from "@framework/product/get-all-products";
import { useUI } from "@contexts/ui.context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";
import Link from "next/link";
import { ROUTES } from "@utils/routes";

/** ---------- Helpers ---------- */
const parsePrice = (v: string | number | undefined): number => {
    if (typeof v === "number") return v;
    if (!v) return 0;
    const first = String(v).split("-")[0].trim();
    const num = Number(first.replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? num : 0;
};

/** ---------- Product Card Component ---------- */
const ProductCard = ({ product }: { product: any }) => {
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
        setModalData({ id: product.id });
        setModalView("PRODUCT_VIEW");
        openModal();
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative">
            <div className="relative overflow-hidden bg-gray-50 h-96">
                <Link
                    href={`${ROUTES.PRODUCT}/${product?.id ?? '/'}`}
                    className="flex items-center justify-start w-full h-full group"
                >
                    <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
                {product.category && (
                    <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {product?.category?.name}
                    </div>
                )}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{discountPercentage}%
                    </div>
                )}
                {/* <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openQuickView();
                    }}
                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-900 transition-colors duration-300"
                >
                    Add To Cart
                </button> */}
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
                    {product.name && product.name.length > 20
                        ? product.name.substring(0, 50) + "..."
                        : product.name || 'Untitled Product'}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        TK. {displayPrice}
                    </span>
                    {originalPrice && (
                        <span className="text-sm font-semibold text-gray-800 line-through">
                            TK. {originalPrice}
                        </span>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4 pt-0 flex items-center ">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openQuickView();
                    }}
                    className=" bg-gray-900 text-white px-6 py-2 hover:bg-[#ff8029] rounded text-sm transition-colors duration-300"
                >
                    Add To Cart
                </button>
            </div>
        </div>
    );
};

export default function CategoryoneSlider({ id }: any) {
    const { data, error } = useProductsQuery({ limit: 10, id } as any);


    const dataList = data?.pages?.[0]?.data;

    if (!dataList || dataList.length === 0) {
        return null;
    }

    const swiperBreakpoints = {
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 3 },
        1440: { slidesPerView: 4 },
    };

    return (
        <section className="">
            <div className="container mx-auto ">


                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        loop={true}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        autoplay={{ delay: 8000, disableOnInteraction: false }}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={swiperBreakpoints}
                    >
                        {dataList.map((product: any) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
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
}