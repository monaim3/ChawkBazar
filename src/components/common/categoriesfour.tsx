import { useCategories } from "@framework/newCategories";
import Loading from "./Loading";
import CategoryoneSlider from "./categoryoneSlider";

const Categoriesfour = () => {
    const { data: categories = [], isLoading } = useCategories();
    if (isLoading) return <Loading />
    const id = categories[3]?.id
    const src = categories[3]?.image

    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                        <CategoryoneSlider id={id} />
                    </div>
                    <div className="flex-shrink-0">
                        <div className="rounded-lg overflow-hidden">
                            <div className="relative  w-full ">
                                <img
                                    src={src}
                                    alt="Category"
                                    className="w-full h-[300px] md:h-[600px] md:w-[400px] object-cover"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
export default Categoriesfour;