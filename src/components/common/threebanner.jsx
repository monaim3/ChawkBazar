import { useAllbanner } from "@framework/allbanner";

export default function Threebanner() {
    const { data, isLoading, error } = useAllbanner();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading banners</div>;



    const src1 = data?.[1]?.images
    return (
        <section className="container mx-auto px-4 md:px-8 lg:px-6">
            <div className="flex flex-col md:flex-row gap-5 py-8">
                <div className="w-full ">
                    <img
                        src={src1[1].image}
                        alt="Main banner"
                        className="w-full h-auto md:h-full object-cover rounded-md"
                    />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-5">
                    <img
                        src={src1[0].image}
                        alt="Banner 1"
                        className="w-full h-64 md:h-72 object-cover rounded-md"
                    />
                    <img
                        src={src1[2].image}
                        alt="Banner 2"
                        className="w-full h-64 md:h-72 object-cover rounded-md"
                    />
                </div>
            </div>
        </section>
    );
}