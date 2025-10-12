"use client"
import Image from "next/image";
import { useAllbanner } from "@framework/allbanner";
import Loading from "./Loading";

const FeatureBanner = () => {
    const { data, isLoading, error } = useAllbanner();
    if (isLoading) return <Loading />;
    if (error) return <div>Error loading banners</div>;


    const src = data?.[0]?.images?.[0]?.image ?? "";
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[550px] relative">
                    <Image
                        src={src}
                        alt="feature-banner"
                        fill
                        className="object-cover rounded-md"
                        priority
                    />
                </div>
            </div>
        </section>
    );
};

export default FeatureBanner;
