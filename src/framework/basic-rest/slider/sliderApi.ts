import { CarouselResponse } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchSlider = async () => {
    const response = await http.get(API_ENDPOINTS.CAROUSEL);

    // response.data = { count: 4, data: [ ... ] }
    return { collections: { data: response.data.data } };
};

// ✅ Hook
export const useCarouselQuery = (options?: CarouselResponse) => {
    return useQuery<{ collections: { data: any[] } }, Error>({
        queryKey: [API_ENDPOINTS.CAROUSEL, options],
        queryFn: fetchSlider,
    });
};
