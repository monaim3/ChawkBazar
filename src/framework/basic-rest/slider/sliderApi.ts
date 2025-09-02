import { CarouselResponse } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchSlider = async () => {
    const {
        data: { data },
    } = await http.get(API_ENDPOINTS.CAROUSEL);
    return { collections: { data: data.data as any[] } };
};
export const useCarouselQuery = (options: CarouselResponse) => {
    return useQuery<{ collections: { data: any[] } }, Error>({
        queryKey: [API_ENDPOINTS.CAROUSEL, options],
        queryFn: fetchSlider
    });
};
