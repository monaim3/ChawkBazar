
import { Organization } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

const fetchFooterInfo = async (): Promise<Organization> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/org/details?orgID=2`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.data;
};

export const useFooter = () => {
    return useQuery<Organization>({
        queryKey: ["footer-info"],
        queryFn: fetchFooterInfo,
    });
};