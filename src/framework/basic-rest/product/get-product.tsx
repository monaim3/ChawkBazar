import { Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchProduct = async (_slug: string) => {
	const { data } = await fetch(
		`https://app.cirqlsync.com/syncing-application/syncapi/product/${_slug}`
	).then((res) => res.json());
	return data;
};
export const useProductQuery = (slug: string) => {
	return useQuery<Product, Error>({
		queryKey: ["product", slug],
		queryFn: () => fetchProduct(slug)
	});
};
