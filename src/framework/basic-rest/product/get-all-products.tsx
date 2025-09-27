import { Product, ProductResponse, QueryOptionsTypes } from "@framework/types";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";

type PaginatedProduct = {
	data: Product[];
	paginatorInfo: ProductResponse["pagination"];
};

const fetchProducts = async (
	context: QueryFunctionContext<[string, QueryOptionsTypes], number>
): Promise<PaginatedProduct> => {
	const { pageParam = 0, queryKey } = context;
	const options: QueryOptionsTypes = queryKey[1] || {};
	const { limit = 10, ...rest } = options;

	// Convert all values to strings
	const params = new URLSearchParams({
		offset: String(pageParam),
		limit: String(limit),
		...Object.fromEntries(
			Object.entries(rest).map(([key, value]) => [key, String(value)])
		),
	});

	const { data } = await http.get<ProductResponse>(
		`https://app.cirqlsync.com/syncing-application/syncapi/product/product-all?orgID=2&branchID=21${params.toString()}`
	);

	return {
		data: data.data,
		paginatorInfo: data.pagination,
	};
};


const useProductsQuery = (options: QueryOptionsTypes = {}) => {
	return useInfiniteQuery<
		PaginatedProduct,
		Error,
		PaginatedProduct,
		[string, QueryOptionsTypes]
	>({
		queryKey: [API_ENDPOINTS.PRODUCTS, options],
		queryFn: fetchProducts,
		getNextPageParam: ({ paginatorInfo }) => {
			const nextOffset = paginatorInfo.offset + paginatorInfo.limit;
			return nextOffset < paginatorInfo.total ? nextOffset : undefined;
		},
	});
};

export { useProductsQuery, fetchProducts };
