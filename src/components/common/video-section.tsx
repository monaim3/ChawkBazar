import { useVideoCategories } from "@framework/video-section";
import Loading from "./Loading";

const VideoSection = () => {
    const { data: categories, isLoading, error } = useVideoCategories();
    if (isLoading) return <Loading />;
    if (error) return <p>Error loading videos</p>;
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                    {categories?.slice(0, 2).map((video: any) => {
                        const embedUrl = video.videoUrl?.replace("watch?v=", "embed/");

                        return (

                            <div key={video.id} className="flex flex-col">
                                <h2 className="text-sm font-bold text-black mb-2">{video?.title}</h2>
                                <iframe
                                    className="w-full h-[450px]"
                                    src={embedUrl}
                                    title={video?.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
export default VideoSection;
