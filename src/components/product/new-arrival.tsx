

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ProductCardGridLoader from "@components/ui/loaders/product-card-grid-loader";
import Alert from "@components/ui/alert";
import { useUI } from "@contexts/ui.context";
import type { Product } from "@framework/types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Import icons from react-icons
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

/** ---------- Types from your API ---------- */
type NewArrival = {
    id: number;
    name: string;
    description?: string | null;
    image: string;
    basePrice: string;   // e.g. "1500 - 2500" or "250"
    finalPrice: string;  // e.g. "1500 - 2500" or "235"
    category?: { id: number; name: string };
    gallery?: { image: string; colorCode: string }[];
    variations?: {
        colors?: { id: number; colorCode: string; value: string }[];
        sizes?: { id: number; value: string }[];
    };
};

/** ---------- Helpers ---------- */
const parsePrice = (v: string | number | undefined): number => {
    if (typeof v === "number") return v;
    if (!v) return 0;
    // take the first number if it's a range like "1500 - 2500"
    const first = String(v).split("-")[0].trim();
    const num = Number(first.replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? num : 0;
};

const slugify = (name: string, id: number) =>
    `${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
    `-${id}`;

/** Map your API item -> ProductCard's Product type */
const adaptToProduct = (p: NewArrival): Product => {
    const price = parsePrice(p.basePrice);
    const sale = parsePrice(p.finalPrice);
    const hasDiscount = sale > 0 && sale < price;

    return {
        id: p.id,
        name: p.name,
        slug: slugify(p.name, p.id),
        description: p.description ?? undefined,
        image: {
            thumbnail: p.image,
            original: p.image,
        },
        price,                         // base price as number
        sale_price: hasDiscount ? sale : undefined,
        quantity: 100,                 // fallback (API doesn't provide it)
        isNewArrival: true,            // optional badge support
        category: p.category,
        // add other optional fields of your Product type if needed
    } as unknown as Product;
};

/** ---------- Data fetching with TanStack Query ---------- */
const fetchProducts = async (): Promise<NewArrival[]> => {
    const res = await fetch(
        "https://app.cirqlsync.com/syncing-application/syncapi/product/new-arrival?orgID=52"
    );
    const data = await res.json();
    return data.data as NewArrival[];
};

/** ---------- Custom Product Card with Reference Image Style ---------- */
const StyledProductCard = ({ product }: { product: NewArrival }) => {
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
        // const adaptedProduct = adaptToProduct(product);
        // setModalData({ data: adaptedProduct });
        // setModalView("PRODUCT_VIEW");
        // openModal();
        const adaptedProduct = adaptToProduct(product);

        // Pass color and size options separately
        setModalData({
            data: adaptedProduct,
            variations: product.variations
        });
        setModalView("PRODUCT_VIEW");
        openModal();
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative">
            {/* Product Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Badge */}
                {product.category && (
                    <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        {product.category.name}
                    </div>
                )}

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Add To Cart Button - always visible */}
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

            {/* Product Info */}
            <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm font-medium">0.0</span>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <AiOutlineStar
                                key={i}
                                size={12}
                                className="text-gray-300"
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">| 0.0</span>
                </div>

                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-800 mb-3 line-clamp-2 leading-5">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        TK. {displayPrice}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            TK. {originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/** ---------- Final: Best Selling Products Carousel (Updated Style) ---------- */
export default function NewArrivalCarousel() {
    const {
        data: apiItems = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["new-arrivals"],
        queryFn: fetchProducts,
    });

    if (isLoading) {
        return (
            <div className=" py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardGridLoader key={i} uniqueKey={`na-loader-${i}`} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <Alert message="Failed to load new arrivals." />;

    return (
        <section className=" py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                {/* Header matching reference image */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex-1 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            NEW ARRIVAL PRODUCTS
                        </h2>
                        <div className="w-20 h-0.5 bg-orange-400 mx-auto"></div>
                    </div>
                    <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        View All
                    </Link>
                </div>

                {/* Custom Swiper with styled navigation */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        loop
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        autoplay={{ delay: 8000, disableOnInteraction: false }}
                        spaceBetween={16}
                        slidesPerView={1}
                        breakpoints={{
                            480: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 }, // 4 visible on desktop
                        }}
                    >
                        {apiItems.map((product) => (
                            <SwiperSlide key={product.id}>
                                <StyledProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
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


// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import ProductCardGridLoader from "@components/ui/loaders/product-card-grid-loader";
// import Alert from "@components/ui/alert";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// // Import icons from react-icons
// import { IoChevronBack, IoChevronForward, IoClose } from 'react-icons/io5';
// import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

// /** ---------- Types from your API ---------- */
// type NewArrival = {
//     id: number;
//     name: string;
//     description?: string | null;
//     image: string;
//     basePrice: string;
//     finalPrice: string;
//     category?: { id: number; name: string };
//     gallery?: { image: string; colorCode: string }[];
//     variations?: {
//         colors?: { id: number; colorCode: string; value: string }[];
//         sizes?: { id: number; value: string }[];
//     };
// };

// /** ---------- Helpers ---------- */
// const parsePrice = (v: string | number | undefined): number => {
//     if (typeof v === "number") return v;
//     if (!v) return 0;
//     const first = String(v).split("-")[0].trim();
//     const num = Number(first.replace(/[^\d.]/g, ""));
//     return Number.isFinite(num) ? num : 0;
// };

// /** ---------- Enhanced Product Modal ---------- */
// const ProductModal = ({ product, isOpen, onClose }: {
//     product: NewArrival | null;
//     isOpen: boolean;
//     onClose: () => void;
// }) => {
//     const [selectedColor, setSelectedColor] = useState<number | null>(null);
//     const [selectedSize, setSelectedSize] = useState<number | null>(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [quantity, setQuantity] = useState(1);

//     if (!isOpen || !product) return null;

//     const basePrice = parsePrice(product.basePrice);
//     const finalPrice = parsePrice(product.finalPrice);
//     const hasDiscount = finalPrice > 0 && finalPrice < basePrice;
//     const displayPrice = finalPrice > 0 ? finalPrice : basePrice;
//     const originalPrice = hasDiscount ? basePrice : null;

//     const discountPercentage = originalPrice && displayPrice
//         ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
//         : 0;

//     // Create image gallery including main image and gallery images
//     const allImages = [
//         product.image,
//         ...(product.gallery?.map(g => g.image) || [])
//     ].filter(Boolean);

//     const nextImage = () => {
//         setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
//     };

//     const prevImage = () => {
//         setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//             <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
//                 >
//                     <IoClose size={20} className="text-gray-600" />
//                 </button>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
//                     {/* Image Gallery Section */}
//                     <div className="space-y-4">
//                         {/* Main Image */}
//                         <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
//                             <img
//                                 src={allImages[currentImageIndex]}
//                                 alt={product.name}
//                                 className="w-full h-full object-cover"
//                             />

//                             {/* Discount Badge */}
//                             {discountPercentage > 0 && (
//                                 <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
//                                     -{discountPercentage}%
//                                 </div>
//                             )}

//                             {/* Navigation arrows for multiple images */}
//                             {allImages.length > 1 && (
//                                 <>
//                                     <button
//                                         onClick={prevImage}
//                                         className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
//                                     >
//                                         <IoChevronBack size={16} className="text-gray-600" />
//                                     </button>
//                                     <button
//                                         onClick={nextImage}
//                                         className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
//                                     >
//                                         <IoChevronForward size={16} className="text-gray-600" />
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {/* Thumbnail Strip */}
//                         {allImages.length > 1 && (
//                             <div className="flex gap-2 overflow-x-auto">
//                                 {allImages.map((image, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => setCurrentImageIndex(index)}
//                                         className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index ? 'border-orange-400' : 'border-gray-200'
//                                             }`}
//                                     >
//                                         <img
//                                             src={image}
//                                             alt={`${product.name} ${index + 1}`}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Product Details Section */}
//                     <div className="space-y-6">
//                         {/* Category */}
//                         {product.category && (
//                             <div className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded">
//                                 {product.category.name}
//                             </div>
//                         )}

//                         {/* Product Name */}
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             {product.name}
//                         </h1>

//                         {/* Rating */}
//                         <div className="flex items-center gap-2">
//                             <div className="flex">
//                                 {[...Array(5)].map((_, i) => (
//                                     <AiOutlineStar
//                                         key={i}
//                                         size={16}
//                                         className="text-gray-300"
//                                     />
//                                 ))}
//                             </div>
//                             <span className="text-sm text-gray-500">(0 reviews)</span>
//                         </div>

//                         {/* Price */}
//                         <div className="flex items-center gap-3">
//                             <span className="text-3xl font-bold text-gray-900">
//                                 TK. {displayPrice}
//                             </span>
//                             {originalPrice && (
//                                 <span className="text-xl text-gray-500 line-through">
//                                     TK. {originalPrice}
//                                 </span>
//                             )}
//                             {discountPercentage > 0 && (
//                                 <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
//                                     Save {discountPercentage}%
//                                 </span>
//                             )}
//                         </div>

//                         {/* Description */}
//                         {product.description && (
//                             <div>
//                                 <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
//                                 <p className="text-gray-600">{product.description}</p>
//                             </div>
//                         )}

//                         {/* Color Variations */}
//                         {product.variations?.colors && product.variations.colors.length > 0 && (
//                             <div>
//                                 <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {product.variations.colors.map((color) => (
//                                         <button
//                                             key={color.id}
//                                             onClick={() => setSelectedColor(color.id)}
//                                             className={`relative flex items-center gap-2 px-3 py-2 border border-gray-400 rounded-lg hover:border-gray-400 transition-colors ${selectedColor === color.id
//                                                 ? 'border-orange-400 bg-orange-50'
//                                                 : 'border-gray-200'
//                                                 }`}
//                                         >
//                                             <div
//                                                 className="w-5 h-5 rounded-full border border-gray-300"
//                                                 style={{ backgroundColor: color.colorCode }}
//                                             ></div>
//                                             <span className="text-sm">{color.value}</span>
//                                             {selectedColor === color.id && (
//                                                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></div>
//                                             )}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 {selectedColor && (
//                                     <p className="text-sm text-gray-600 mt-2">
//                                         Selected: {product.variations.colors.find(c => c.id === selectedColor)?.value}
//                                     </p>
//                                 )}
//                             </div>
//                         )}

//                         {/* Size Variations */}
//                         {product.variations?.sizes && product.variations.sizes.length > 0 && (
//                             <div>
//                                 <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {product.variations.sizes.map((size) => (
//                                         <button
//                                             key={size.id}
//                                             onClick={() => setSelectedSize(size.id)}
//                                             className={`px-4 py-2 border border-gray-400 rounded-lg hover:border-gray-400 transition-colors ${selectedSize === size.id
//                                                 ? 'border-orange-400 bg-orange-50 text-orange-800'
//                                                 : 'border-gray-200'
//                                                 }`}
//                                         >
//                                             {size.value}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 {selectedSize && (
//                                     <p className="text-sm text-gray-600 mt-2">
//                                         Selected: {product.variations.sizes.find(s => s.id === selectedSize)?.value}
//                                     </p>
//                                 )}
//                             </div>
//                         )}

//                         {/* Quantity Selector */}
//                         <div>
//                             <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
//                             <div className="flex items-center border border-gray-400  rounded-lg w-fit">
//                                 <button
//                                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                     className="px-3 py-2 "
//                                 >
//                                     -
//                                 </button>
//                                 <span className="px-4 py-2 border   min-w-[50px] text-center">
//                                     {quantity}
//                                 </span>
//                                 <button
//                                     onClick={() => setQuantity(quantity + 1)}
//                                     className="px-3 py-2"
//                                 >
//                                     +
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-3 pt-4">
//                             <button className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium">
//                                 Add to Cart
//                             </button>
//                         </div>

//                         {/* Additional Info */}
//                         {/* <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
//                             <div className="flex justify-between">
//                                 <span>SKU:</span>
//                                 <span>#{product.id.toString().padStart(6, '0')}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span>Availability:</span>
//                                 <span className="text-green-600">In Stock</span>
//                             </div>
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// /** ---------- Custom Product Card ---------- */
// const StyledProductCard = ({
//     product,
//     onOpenModal
// }: {
//     product: NewArrival;
//     onOpenModal: (product: NewArrival) => void;
// }) => {
//     const basePrice = parsePrice(product.basePrice);
//     const finalPrice = parsePrice(product.finalPrice);

//     const hasDiscount = finalPrice > 0 && finalPrice < basePrice;
//     const displayPrice = finalPrice > 0 ? finalPrice : basePrice;
//     const originalPrice = hasDiscount ? basePrice : null;

//     const discountPercentage = originalPrice && displayPrice
//         ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
//         : 0;

//     return (
//         <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative">
//             {/* Product Image Container */}
//             <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
//                 <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />

//                 {/* Category Badge */}
//                 {product.category && (
//                     <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
//                         {product.category.name}
//                     </div>
//                 )}

//                 {/* Discount Badge */}
//                 {discountPercentage > 0 && (
//                     <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
//                         -{discountPercentage}%
//                     </div>
//                 )}

//                 {/* Add To Cart Button */}
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onOpenModal(product);
//                     }}
//                     className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-900 transition-colors duration-300"
//                 >
//                     Add To Cart
//                 </button>
//             </div>

//             {/* Product Info */}
//             <div className="p-4">
//                 {/* Rating */}
//                 <div className="flex items-center gap-1 mb-2">
//                     <span className="text-sm font-medium">0.0</span>
//                     <div className="flex">
//                         {[...Array(5)].map((_, i) => (
//                             <AiOutlineStar
//                                 key={i}
//                                 size={12}
//                                 className="text-gray-300"
//                             />
//                         ))}
//                     </div>
//                     <span className="text-xs text-gray-500">| 0.0</span>
//                 </div>

//                 {/* Product Name */}
//                 <h3 className="text-sm font-semibold text-gray-800 mb-3 line-clamp-2 leading-5">
//                     {product.name}
//                 </h3>

//                 {/* Price */}
//                 <div className="flex items-center gap-2">
//                     <span className="text-lg font-bold text-gray-900">
//                         TK. {displayPrice}
//                     </span>
//                     {originalPrice && (
//                         <span className="text-sm text-gray-500 line-through">
//                             TK. {originalPrice}
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// /** ---------- Data fetching ---------- */
// const fetchProducts = async (): Promise<NewArrival[]> => {
//     const res = await fetch(
//         "https://app.cirqlsync.com/syncing-application/syncapi/product/new-arrival?orgID=52"
//     );
//     const data = await res.json();
//     return data.data as NewArrival[];
// };

// /** ---------- Main Carousel Component ---------- */
// export default function NewArrivalCarousel() {
//     const [selectedProduct, setSelectedProduct] = useState<NewArrival | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const {
//         data: apiItems = [],
//         isLoading,
//         error,
//     } = useQuery({
//         queryKey: ["new-arrivals"],
//         queryFn: fetchProducts,
//     });

//     const openModal = (product: NewArrival) => {
//         setSelectedProduct(product);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setSelectedProduct(null);
//         setIsModalOpen(false);
//     };

//     if (isLoading) {
//         return (
//             <div className="py-8">
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {Array.from({ length: 8 }).map((_, i) => (
//                             <ProductCardGridLoader key={i} uniqueKey={`na-loader-${i}`} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) return <Alert message="Failed to load new arrivals." />;

//     return (
//         <>
//             <section className="py-8">
//                 <div className="container mx-auto px-4 md:px-8 lg:px-6">
//                     {/* Header matching reference image */}
//                     <div className="flex items-center justify-between mb-8">
//                         <div className="flex-1 text-center">
//                             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                                 NEW ARRIVAL PRODUCTS
//                             </h2>
//                             <div className="w-20 h-0.5 bg-orange-400 mx-auto"></div>
//                         </div>
//                         <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
//                             View All
//                         </Link>
//                     </div>

//                     {/* Custom Swiper with styled navigation */}
//                     <div className="relative">
//                         <Swiper
//                             modules={[Autoplay, Navigation]}
//                             loop
//                             navigation={{
//                                 prevEl: '.swiper-button-prev-custom',
//                                 nextEl: '.swiper-button-next-custom',
//                             }}
//                             autoplay={{ delay: 8000, disableOnInteraction: false }}
//                             spaceBetween={16}
//                             slidesPerView={1}
//                             breakpoints={{
//                                 480: { slidesPerView: 2 },
//                                 768: { slidesPerView: 3 },
//                                 1024: { slidesPerView: 4 }, // 4 visible on desktop
//                             }}
//                         >
//                             {apiItems.map((product) => (
//                                 <SwiperSlide key={product.id}>
//                                     <StyledProductCard
//                                         product={product}
//                                         onOpenModal={openModal}
//                                     />
//                                 </SwiperSlide>
//                             ))}
//                         </Swiper>

//                         {/* Custom Navigation Buttons */}
//                         <button
//                             className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
//                             aria-label="Previous products"
//                         >
//                             <IoChevronBack size={20} className="text-gray-600" />
//                         </button>

//                         <button
//                             className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
//                             aria-label="Next products"
//                         >
//                             <IoChevronForward size={20} className="text-gray-600" />
//                         </button>
//                     </div>
//                 </div>

//                 <style jsx>{`
//                     .line-clamp-2 {
//                         display: -webkit-box;
//                         -webkit-line-clamp: 2;
//                         -webkit-box-orient: vertical;
//                         overflow: hidden;
//                     }
//                 `}</style>
//             </section>

//             {/* Enhanced Product Modal */}
//             <ProductModal
//                 product={selectedProduct}
//                 isOpen={isModalOpen}
//                 onClose={closeModal}
//             />
//         </>
//     );
// }