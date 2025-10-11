import { Product } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

export const fetchProduct = async (_slug: string) => {
	const { data } = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/product/${_slug}`
	).then((res) => res.json());
	return data;
};
export const useProductQuery = (slug: string) => {
	return useQuery<Product, Error>({
		queryKey: ["product", slug],
		queryFn: () => fetchProduct(slug)
	});
};
