import Image from "next/image";
import middleBanner from "@public/assets/images/banner/middle-banner.webp";

const FeatureBanner = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[550px] relative">
                    <Image
                        src={middleBanner}
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
