"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import http from "@framework/utils/http";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Loading from "./Loading";

interface SlideItem {
    id: number;
    title: string;
    caption?: string | null;
    image: string;
    display_order: number;
}

export default function CarouselSlider() {
    const [slides, setSlides] = useState<SlideItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setLoading(true);
                const res = await http.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/carousel/homepage-carousel?orgID=2`
                );
                setSlides(res.data?.data || []);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    if (loading) return <Loading></Loading>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            effect="fade"
            speed={1200}
            className="w-full h-[400px] md:h-[600px] lg:h-[80vh]"
        >
            {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                    <div
                        className="w-full h-full flex items-center justify-center bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        {/* <div className="bg-black bg-opacity-40 p-4 rounded">
                            {slide.title && (
                                <h2 className="text-white text-xl md:text-3xl font-bold">
                                    {slide.title}
                                </h2>
                            )}
                            {slide.caption && (
                                <p className="text-white text-sm md:text-lg">{slide.caption}</p>
                            )}
                        </div> */}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
