"use client";
import dynamic from "next/dynamic";
import type { GenericProduct } from "@components/common/generic-carousel";

const GenericCarousel = dynamic(
    () =>
        import("@components/common/generic-carousel").then(
            (mod) => mod.GenericCarousel
        ),
    { ssr: false }
);

export default function NewArrivalSection() {
    // Fetcher function inside the component
    const fetchNewArrivals = async (): Promise<GenericProduct[]> => {
        const res = await fetch(
            "https://app.cirqlsync.com/syncing-application/syncapi/product/new-arrival?orgID=2"
        );
        const data = await res.json();
        return data.data;
    };

    return (
        <GenericCarousel
            title="New Arrival Products"
            viewAllLink="/products"
            fetcher={fetchNewArrivals}
        />
    );
}


