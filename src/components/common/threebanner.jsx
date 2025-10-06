import { useAllbanner } from "@framework/allbanner";

export default function Threebanner() {
    const { data, isLoading, error } = useAllbanner();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading banners</div>;



    const src1 = data?.[1]?.images
    console.log("src2", src1[0])
    return (
        <section className="container mx-auto px-4 md:px-8 lg:px-6">
            {/* Fixed Background Image */}
            <div className=" flex gap-5 py-8">
                <div
                    className=" bg-cover bg-center "
                >
                    <img src={src1[1].image} alt="" />

                </div>
                <div className="flex flex-col gap-5">
                    <img src={src1[0].image} alt="bannerimg" className="h-72 rounded-md" />
                    <img src={src1[2].image} alt="" className="h-72" />
                </div>
            </div>

        </section>
    );
}