import { DeliveryCharge } from "@framework/types";
import { useQuery } from "@tanstack/react-query";


const fetchDeliveryCharge = async (): Promise<DeliveryCharge[]> => {
    const res = await fetch("https://app.cirqlsync.com/syncing-application/syncapi/location/districts?division_id=1");
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data;
};

export const useDeliveryCharge = () => {
    return useQuery<DeliveryCharge[]>({
        queryKey: ["delivery-charge"],
        queryFn: fetchDeliveryCharge,
    });
};
