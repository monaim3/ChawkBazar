import { Allbanner } from "@framework/types";
import { useQuery } from "@tanstack/react-query";


const fetchAllbanner = async (): Promise<Allbanner[]> => {
    const res = await fetch("https://app.cirqlsync.com/syncing-application/syncapi/banner/images?orgID=2");
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.data;
};

export const useAllbanner = () => {
    return useQuery<Allbanner[]>({
        queryKey: ["banner"],
        queryFn: fetchAllbanner,
    });
};
