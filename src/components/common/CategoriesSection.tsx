"use client";
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
  const [itemsPerView, setItemsPerView] = useState(4); // default desktop
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Handle responsiveness
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // tablet
      } else {
        setItemsPerView(4); // desktop
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

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
    return <Loading />;
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            BROWSE OUR CATEGORIES
          </h2>
          <div className="w-24 md:w-32 h-0.5 bg-gray-800 mx-auto"></div>
        </div>

        <div className="relative">
          {/* Navigation */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          >
            <IoChevronBack className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          >
            <IoChevronForward className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden rounded-lg mx-8 md:mx-16">
            <div
              ref={carouselRef}
              className={`flex ${isTransitioning
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
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Link
                    href={
                      category.id
                        ? `/search?category=${category.id}&categoryName=${category?.name?.toLocaleLowerCase()}`
                        : "/"
                    }>
                    <div className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105">
                      <div className="aspect-[5/5] relative overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category?.name}
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 md:top-4 md:right-4">
                          <div className="w-14 md:w-16 h-7 md:h-8 bg-white/90 rounded flex items-center justify-center">
                            <span className="text-xs md:text-sm font-medium text-gray-800">
                              GLAM
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 md:p-4">
                        <h3 className="text-xs md:text-sm font-medium text-gray-800 text-center uppercase tracking-wide">
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
