import Logo from "@components/ui/logo";
import { useAllbanner } from "@framework/allbanner";

export default function Hero() {
    const { data, isLoading, error } = useAllbanner();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading banners</div>;


    const src = data?.[2]?.images?.[0]?.image ?? "";
    return (
        <section className="relative  flex items-center justify-center overflow-hidden">
            {/* Fixed Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: `url(${src})`,
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                <div className="bg-[#d3d3d3] backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* Logo */}
                    <div className="flex-1 flex justify-center mx-8">
                        <Logo />
                    </div>

                    {/* Main Content */}
                    <div className="text-center space-y-4 text-gray-700 mt-6">
                        <p className="text-sm md:text-sm leading-relaxed">
                            <span className="font-semibold">"Glam Touch"</span> is a Prominent Women's Clothing Brand® Serving Nationally
                        </p>

                        <p className="text-sm md:text-sm leading-relaxed">
                            Since <span className="font-semibold">2019</span>. Our mission is to become the leading Modest Fashion brand for Muslim Women. We are spreading the Interest of Modesty with Nobility and Truly Presenting the <span className="font-semibold">"Glamour of Modesty"</span>
                        </p>

                        <p className="text-sm md:text-sm leading-relaxed">
                            We are reputed for quality Products and priority customer service & ensuring Trustworthiness. We firmly believe that Clients' Happiness is timeless. We are continuously working to Make confident in modesty and more importantly how she feels.
                        </p>
                    </div>
                </div>
            </div>

        </section>
    );
}