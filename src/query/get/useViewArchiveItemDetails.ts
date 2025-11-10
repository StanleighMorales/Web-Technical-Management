import { queryOptions } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const viewArchiveItemDetails = async (id: string) => {
    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const VERSION = "v1";
        const END_POINT = `/api/${VERSION}/archiveitems`;

        const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (res.status === 401) {
            removeToken();
            return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Archived item details not found");

        return data.data;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const useViewArchiveItemDetails = (id: string) => {
    return queryOptions({
        queryKey: ["ArchiveItem", id],
        queryFn: () => viewArchiveItemDetails(id),
    });
};
