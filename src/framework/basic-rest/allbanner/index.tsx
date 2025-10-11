import { Allbanner } from "@framework/types";
import { useQuery } from "@tanstack/react-query";


const fetchAllbanner = async (): Promise<Allbanner[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/banner/images?orgID=2`);
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
