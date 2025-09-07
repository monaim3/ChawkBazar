
"use client";

import { GenericCarousel, GenericProduct } from "@components/common/generic-carousel";

export default function BestSelling() {
    // Fetcher function inside the component
    const fetchSelling = async (): Promise<GenericProduct[]> => {
        const res = await fetch(
            "https://app.cirqlsync.com/syncing-application/syncapi/product/to-selling?orgID=52"
        );
        const data = await res.json();
        return data.data;
    };

    return (
        <GenericCarousel
            title="Best Selling Products"
            viewAllLink="/products"
            fetcher={fetchSelling}
        />
    );
}



