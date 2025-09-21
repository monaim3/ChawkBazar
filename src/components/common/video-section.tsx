const VideoSection = () => {
    const videoList = [
        {
            id: 1,
            src: "https://www.youtube.com/embed/KUhQJQSZD7U",
            title: "DESIGNER KARCHUPI ABAYA"
        },
        {
            id: 2,
            src: "https://www.youtube.com/embed/nbJJYSE9qyI",
            title: "Eid Collection-2025"
        }
    ];
    return (
        <section className="py-8">
            <div className="container mx-auto px-4 md:px-8 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                    {videoList.map((video: any) => (
                        <div key={video.id} className="flex flex-col">
                            <h2 className="text-sm font-bold text-black mb-2">{video.title}</h2>
                            <iframe
                                className="w-full h-[500px]"
                                src={video.src}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default VideoSection;
