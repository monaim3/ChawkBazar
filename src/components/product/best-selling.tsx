
"use client";

import { GenericProduct } from "@components/common/generic-carousel";
import dynamic from "next/dynamic";
const GenericCarousel = dynamic(
    () =>
        import("@components/common/generic-carousel").then(
            (mod) => mod.GenericCarousel
        ),
    { ssr: false }
);
export default function BestSelling() {
    // Fetcher function inside the component
    const fetchSelling = async (): Promise<GenericProduct[]> => {
        const res = await fetch(
            "https://app.cirqlsync.com/syncing-application/syncapi/product/to-selling?orgID=2"
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



