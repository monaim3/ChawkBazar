import { useQuery } from "@tanstack/react-query";

interface Product {
    id: number;
    name: string;
    // add more fields based on your API response
}

const fetchProducts = async (search: string): Promise<Product[]> => {
    const url = new URL(
        `${process.env.NEXT_PUBLIC_BASE_URL}/product/product-all?orgID=2&branchID=21`
    );
    url.searchParams.append("search", search);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    return data.data;
};

export const useProducts = (search: string) => {
    return useQuery<Product[]>({
        queryKey: ["products", search], // cache per search query
        queryFn: () => fetchProducts(search),
        enabled: !!search, // only run if search is not empty
    });
};
