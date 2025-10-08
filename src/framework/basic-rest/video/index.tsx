
import { Video } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

const fetchVideos = async (): Promise<Video[]> => {
    const res = await fetch(" https://app.cirqlsync.com/syncing-application/syncapi/video/url?orgID=2");
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.data;
};

export const useVideos = () => {
    return useQuery<Video[]>({
        queryKey: ["videos"],
        queryFn: fetchVideos,
    });
};