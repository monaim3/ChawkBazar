"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useSelector } from "react-redux";

// ** Import Iocns
import { HiChevronRight } from "react-icons/hi2";
import { useCarouselQuery } from "@framework/slider/sliderApi";

const IntroSlider = () => {
    const { data, isLoading } = useCarouselQuery({});
    if (isLoading) return <p>Loading...</p>;

    //   return (
    //     <>
    //       <Swiper
    //         modules={[Pagination, Autoplay, EffectFade]}
    //         slidesPerView={1}
    //         spaceBetween={0}
    //         loop={true}
    //         pagination={{ clickable: true }}
    //         className="hero-slider"
    //         autoplay={{ delay: 3000 }}
    //         effect="fade"
    //         speed={1200}
    //       >
    //         {sliders.map((slide, i) => (
    //           <SwiperSlide key={i}>
    //             <div
    //               className={`relative single-hero-slider bg-top px-3 lg:px-12 md:py-10 text-center flex justify-center items-center ${
    //                 settings?.offer_massage
    //                   ? "h-[203px] md:h-[353px] lg:h-[85vh]"
    //                   : "h-[213px] md:h-[363px] lg:h-[88vh]"
    //               } bg-no-repeat bg-cover bg-center`}
    //               style={{
    //                 backgroundImage: slide?.image
    //                   ? `url(${slide?.image})`
    //                   : `/assets/images/banner/banner-1.png`,
    //               }}
    //             >
    //               <div className="">
    //                 <div
    //                   className={cn(
    //                     "hero-slider-content p-4 lg:px-12 py-6"
    //                     // isBackdrop(slide) ? "backdrop-blur-sm" : ""
    //                   )}
    //                   style={{
    //                     // backgroundColor: settings?.colors?.primary,
    //                     // color: settings?.colors?.default_text,
    //                     color: settings?.colors?.primary_text,
    //                   }}
    //                 >
    //                   {slide?.title && (
    //                     <p className="text-sm lg:text-lg/[24px] font-normal font-body lg:mb-4">
    //                       {slide?.title}
    //                     </p>
    //                   )}
    //                   {slide?.title_2 && (
    //                     <h1 className="text-xl lg:text-5xl font-bold font-title">
    //                       {slide?.title_2}
    //                     </h1>
    //                   )}
    //                   {slide?.text && (
    //                     <h2 className="text-lg lg:text-4xl/[48px] font-bold font-title mb-2 lg:my-5">
    //                       {slide?.text}
    //                     </h2>
    //                   )}
    //                   {/* {slide?.url && (
    //                     <Link
    //                       href={slide?.url}
    //                       className="inline-block px-4 text-center leading-[40px] rounded-lg"
    //                       style={{
    //                         backgroundColor: settings?.colors?.primary,
    //                         color: settings?.colors?.primary_text,
    //                       }}
    //                     >
    //                       {translations["shop-now"] || "Shop Now"}
    //                     </Link>
    //                   )} */}
    //                 </div>
    //               </div>
    //               {slide.url && (
    //                 <Link
    //                   href={slide?.url}
    //                   className="absolute h-full w-full flex items-center justify-center"
    //                 ></Link>
    //               )}
    //             </div>
    //           </SwiperSlide>
    //         ))}
    //       </Swiper>
    //     </>
    //   );
    return (
        <h2>Works</h2>
    )
};

export default IntroSlider;
