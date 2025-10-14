

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUI } from "@contexts/ui.context";
import type { Product } from "@framework/types";

import { AiOutlineStar } from "react-icons/ai";
import { ROUTES } from "@utils/routes";

/** ---------- Types ---------- */
export type GenericProduct = {
    id: number | string;
    name: string;
    description?: string | null;
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

/** ---------- Product Card Component ---------- */
const ProductCard = ({ product }: { product: GenericProduct }) => {

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
        <div className="bg-gray-200 rounded-lg shadow-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative">
            <div className="relative overflow-hidden bg-gray-50 h-96">
                <Link
                    href={`${ROUTES.PRODUCT}/${product?.id ?? '/'}`}
                    className="flex items-center justify-start w-full h-full group"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>
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
                        <span className="text-sm font-semibold text-gray-800 line-through">
                            TK. {originalPrice}
                        </span>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4 pt-0 flex items-center">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openQuickView();
                    }}
                    className="bg-gray-900 text-white px-6 py-2 hover:bg-[#ff8029] rounded text-sm transition-colors duration-300"
                >
                    Add To Cart
                </button>
            </div>
        </div>
    );
};
export default ProductCard;
