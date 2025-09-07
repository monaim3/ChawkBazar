

// "use client";

// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import ProductCardGridLoader from "@components/ui/loaders/product-card-grid-loader";
// import Alert from "@components/ui/alert";
// import { useUI } from "@contexts/ui.context";
// import type { Product } from "@framework/types";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// // Import icons from react-icons
// import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
// import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

// /** ---------- Types from your API ---------- */
// type NewArrival = {
//     id: number;
//     name: string;
//     description?: string | null;
//     image: string;
//     basePrice: string;   // e.g. "1500 - 2500" or "250"
//     finalPrice: string;  // e.g. "1500 - 2500" or "235"
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
//     // take the first number if it's a range like "1500 - 2500"
//     const first = String(v).split("-")[0].trim();
//     const num = Number(first.replace(/[^\d.]/g, ""));
//     return Number.isFinite(num) ? num : 0;
// };

// const slugify = (name: string, id: number) => `${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${id}`;

// /** Map your API item -> ProductCard's Product type */
// const adaptToProduct = (p: NewArrival): Product => {
//     console.log("p", p);
//     const price = parsePrice(p.basePrice);
//     const sale = parsePrice(p.finalPrice);
//     const hasDiscount = sale > 0 && sale < price;

//     return {
//         id: p.id,
//         name: p.name,
//         slug: slugify(p.name, p.id),
//         description: p.description ?? undefined,
//         image: {
//             thumbnail: p.image,
//             original: p.image,
//         },
//         price,                         // base price as number
//         sale_price: hasDiscount ? sale : undefined,
//         quantity: 0,                 // fallback (API doesn't provide it)
//         isNewArrival: true,            // optional badge support
//         category: p.category,
//         variations: p.variations ?? undefined,  // ✅ include variations
//         gallery: p.gallery ?? [],              // ✅ include gallery if needed
//         // add other optional fields of your Product type if needed
//     } as unknown as Product;
// };

// /** ---------- Data fetching with TanStack Query ---------- */
// const fetchProducts = async (): Promise<NewArrival[]> => {
//     const res = await fetch(
//         "https://app.cirqlsync.com/syncing-application/syncapi/product/new-arrival?orgID=52"
//     );
//     const data = await res.json();
//     return data.data as NewArrival[];
// };

// /** ---------- Custom Product Card with Reference Image Style ---------- */
// const StyledProductCard = ({ product }: { product: NewArrival }) => {
//     const { setModalData, setModalView, openModal } = useUI();

//     const basePrice = parsePrice(product.basePrice);
//     const finalPrice = parsePrice(product.finalPrice);

//     const hasDiscount = finalPrice > 0 && finalPrice < basePrice;
//     const displayPrice = finalPrice > 0 ? finalPrice : basePrice;
//     const originalPrice = hasDiscount ? basePrice : null;

//     const discountPercentage = originalPrice && displayPrice
//         ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
//         : 0;

//     const openQuickView = () => {
//         // const adaptedProduct = adaptToProduct(product);
//         // setModalData({ data: adaptedProduct });
//         // setModalView("PRODUCT_VIEW");
//         // openModal();
//         const adaptedProduct = adaptToProduct(product);

//         // Pass color and size options separately
//         setModalData({
//             data: adaptedProduct,
//         });
//         setModalView("PRODUCT_VIEW");
//         openModal();
//     };

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

//                 {/* Add To Cart Button - always visible */}
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         openQuickView();
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
//                 <h3 className="text-sm font-medium text-gray-800 mb-3 line-clamp-2 leading-5">
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

// /** ---------- Final: Best Selling Products Carousel (Updated Style) ---------- */
// export default function NewArrivalCarousel() {
//     const {
//         data: apiItems = [],
//         isLoading,
//         error,
//     } = useQuery({
//         queryKey: ["new-arrivals"],
//         queryFn: fetchProducts,
//     });

//     if (isLoading) {
//         return (
//             <div className=" py-8">
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
//         <section className=" py-8">
//             <div className="container mx-auto px-4 md:px-8 lg:px-6">
//                 {/* Header matching reference image */}
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex-1 text-center">
//                         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                             NEW ARRIVAL PRODUCTS
//                         </h2>
//                         <div className="w-20 h-0.5 bg-orange-400 mx-auto"></div>
//                     </div>
//                     <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
//                         View All
//                     </Link>
//                 </div>

//                 {/* Custom Swiper with styled navigation */}
//                 <div className="relative">
//                     <Swiper
//                         modules={[Autoplay, Navigation]}
//                         loop
//                         navigation={{
//                             prevEl: '.swiper-button-prev-custom',
//                             nextEl: '.swiper-button-next-custom',
//                         }}
//                         autoplay={{ delay: 8000, disableOnInteraction: false }}
//                         spaceBetween={16}
//                         slidesPerView={1}
//                         breakpoints={{
//                             480: { slidesPerView: 2 },
//                             768: { slidesPerView: 3 },
//                             1024: { slidesPerView: 4 }, // 4 visible on desktop
//                         }}
//                     >
//                         {apiItems.map((product) => (
//                             <SwiperSlide key={product.id}>
//                                 <StyledProductCard product={product} />
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>

//                     {/* Custom Navigation Buttons */}
//                     <button
//                         className="swiper-button-prev-custom absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
//                         aria-label="Previous products"
//                     >
//                         <IoChevronBack size={20} className="text-gray-600" />
//                     </button>

//                     <button
//                         className="swiper-button-next-custom absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
//                         aria-label="Next products"
//                     >
//                         <IoChevronForward size={20} className="text-gray-600" />
//                     </button>
//                 </div>
//             </div>

//             <style jsx>{`
//                 .line-clamp-2 {
//                     display: -webkit-box;
//                     -webkit-line-clamp: 2;
//                     -webkit-box-orient: vertical;
//                     overflow: hidden;
//                 }
//             `}</style>
//         </section>
//     );
// }


"use client";

import { GenericCarousel, GenericProduct } from "@components/common/generic-carousel";

export default function NewArrivalSection() {
    // Fetcher function inside the component
    const fetchNewArrivals = async (): Promise<GenericProduct[]> => {
        const res = await fetch(
            "https://app.cirqlsync.com/syncing-application/syncapi/product/new-arrival?orgID=52"
        );
        const data = await res.json();
        return data.data;
    };

    return (
        <GenericCarousel
            title="New Arrival Products"
            viewAllLink="/products"
            fetcher={fetchNewArrivals}
        />
    );
}



