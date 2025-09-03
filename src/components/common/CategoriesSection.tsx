// import React, { useState, useRef, useEffect } from "react";
// import { IoChevronBack, IoChevronForward } from "react-icons/io5";
// import Image from 'next/image'

// const CategoriesSection = () => {
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [isTransitioning, setIsTransitioning] = useState(false);
//     const carouselRef = useRef(null);

//     // Dummy categories data - replace with API data later
//     const categories = [
//         {
//             id: 1,
//             title: "DESIGNER PREMIUM ABAYAS",
//             image: "https://static.bitcommerz.com/glamtouch/media/sm/175337417429422013213_4_designer_karchupi_abayas_cart.webp",
//             alt: "Designer Premium Abayas"
//         },
//         {
//             id: 2,
//             title: "HIJAB & NIQAB",
//             image: "https://static.bitcommerz.com/glamtouch/media/sm/175337417838811672535_5_abaya_gown_card.webp",
//             alt: "Hijab & Niqab Collection"
//         },
//         {
//             id: 3,
//             title: "KHIMAR & JILBAB",
//             image: "https://static.bitcommerz.com/glamtouch/media/sm/175337417008764159077_3_khimar_jilbab_cart.webp",
//             alt: "Khimar & Jilbab Collection"
//         },
//         {
//             id: 4,
//             title: "DESIGNER KARCHUP ABAYA",
//             image: "https://static.bitcommerz.com/glamtouch/media/sm/175337417429422013213_4_designer_karchupi_abayas_cart.webp",
//             alt: "Designer Karchup Abaya"
//         },
//         {
//             id: 5,
//             title: "CAPE & COVER UP",
//             image: "https://static.bitcommerz.com/glamtouch/media/sm/175337417838811672535_5_abaya_gown_card.webp",
//             alt: "Cape & Cover Up Collection"
//         },
//         {
//             id: 6,
//             title: "UNDERGARMENTS",
//             image: "https://static.bitcommerz.com/glamtouch/media/sm/175337417008764159077_3_khimar_jilbab_cart.webp",
//             alt: "Undergarments Collection"
//         }
//     ];

//     const itemsPerView = 4;

//     // Create extended array for seamless looping
//     const extendedCategories = [
//         ...categories.slice(-itemsPerView), // Last items (for beginning)
//         ...categories,                      // All items
//         ...categories.slice(0, itemsPerView) // First items (for end)
//     ];

//     const totalSlides = categories.length;
//     const extendedTotalSlides = extendedCategories.length;

//     const nextSlide = () => {
//         if (isTransitioning) return;
//         setIsTransitioning(true);
//         setCurrentSlide(prev => prev + 1);
//     };

//     const prevSlide = () => {
//         if (isTransitioning) return;
//         setIsTransitioning(true);
//         setCurrentSlide(prev => prev - 1);
//     };

//     // Handle infinite scroll reset
//     useEffect(() => {
//         const handleTransitionEnd = () => {
//             setIsTransitioning(false);

//             // Reset position without animation for seamless looping
//             if (currentSlide >= totalSlides) {
//                 setCurrentSlide(0);
//             } else if (currentSlide < 0) {
//                 setCurrentSlide(totalSlides - 1);
//             }
//         };

//         if (isTransitioning) {
//             const timer = setTimeout(handleTransitionEnd, 500);
//             return () => clearTimeout(timer);
//         }
//     }, [currentSlide, isTransitioning, totalSlides]);

//     // Calculate the actual slide index in the extended array
//     const actualSlide = currentSlide + itemsPerView;

//     // Calculate translation
//     const translateX = actualSlide * (100 / itemsPerView);

//     return (
//         <section className="py-8 bg-white">
//             <div className="container mx-auto px-4 md:px-8 lg:px-6">
//                 {/* Section Title */}
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl md:text-3xl font-bold text-black mb-4">
//                         BROWSE OUR CATEGORIES
//                     </h2>
//                     <div className="w-32 h-0.5 bg-gray-800 mx-auto"></div>
//                 </div>

//                 {/* Carousel Container */}
//                 <div className="relative">
//                     {/* Navigation Arrows */}
//                     <button
//                         onClick={prevSlide}
//                         disabled={isTransitioning}
//                         className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
//                         aria-label="Previous categories"
//                     >
//                         <IoChevronBack className="w-6 h-6 text-gray-600" />
//                     </button>

//                     <button
//                         onClick={nextSlide}
//                         disabled={isTransitioning}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
//                         aria-label="Next categories"
//                     >
//                         <IoChevronForward className="w-6 h-6 text-gray-600" />
//                     </button>

//                     {/* Carousel Wrapper */}
//                     <div className="overflow-hidden rounded-lg mx-16">
//                         <div
//                             ref={carouselRef}
//                             className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
//                             style={{
//                                 transform: `translateX(-${translateX}%)`,
//                                 // width: `${(extendedTotalSlides / itemsPerView) * 100}%`
//                             }}
//                         >
//                             {/* Category Cards */}
//                             {extendedCategories.map((category, index) => (
//                                 <div
//                                     key={`${category.id}-${index}`}
//                                     className="flex-shrink-0 px-3"
//                                     style={{ width: `${100 / itemsPerView}%` }}
//                                 >
//                                     <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105">
//                                         <div className="aspect-[5/5] relative overflow-hidden">
//                                             <Image
//                                                 src={category.image}
//                                                 alt={category.alt}
//                                                 fill
//                                                 className="object-cover"
//                                                 loading="lazy"
//                                             />
//                                             <div className="absolute top-4 right-4">
//                                                 <div className="w-16 h-8 bg-white/90 rounded flex items-center justify-center">
//                                                     <span className="text-xs font-medium text-gray-800">GLAM</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4">
//                                             <h3 className="text-sm font-medium text-gray-800 text-center uppercase tracking-wide">
//                                                 {category.title}
//                                             </h3>
//                                         </div>
//                                     </div>
//                                 </div>

//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CategoriesSection;



import React, { useState, useRef, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@framework/types";
import { useCategories } from "@framework/newCategories";
import Loading from "./Loading";

const CategoriesSection: React.FC = () => {
  const { data: categories = [], isLoading } = useCategories();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const itemsPerView = 4;

  // Extended categories for infinite loop
  const extendedCategories = [
    ...categories.slice(-itemsPerView),
    ...categories,
    ...categories.slice(0, itemsPerView),
  ];

  const totalSlides = categories.length;

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  useEffect(() => {
    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      if (currentSlide >= totalSlides) setCurrentSlide(0);
      if (currentSlide < 0) setCurrentSlide(totalSlides - 1);
    };

    if (isTransitioning) {
      const timer = setTimeout(handleTransitionEnd, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isTransitioning, totalSlides]);

  const actualSlide = currentSlide + itemsPerView;
  const translateX = actualSlide * (100 / itemsPerView);

  if (isLoading) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            BROWSE OUR CATEGORIES
          </h2>
          <div className="w-32 h-0.5 bg-gray-800 mx-auto"></div>
        </div>

        <div className="relative">
          {/* Navigation */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          >
            <IoChevronBack className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          >
            <IoChevronForward className="w-6 h-6 text-gray-600" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden rounded-lg mx-16">
            <div
              ref={carouselRef}
              className={`flex ${
                isTransitioning
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(-${translateX}%)`,
              }}
            >
              {extendedCategories.map((category: Category, index: number) => (
                <div
                  key={`${category.id}-${index}`}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Link href={`/category/${category.slug}`}>
                    <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105">
                      <div className="aspect-[5/5] relative overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="w-16 h-8 bg-white/90 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-800">
                              GLAM
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4">
                        <h3 className="text-sm font-medium text-gray-800 text-center uppercase tracking-wide">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
