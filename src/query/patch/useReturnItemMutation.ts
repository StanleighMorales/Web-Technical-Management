import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

type ReturnItemData = {
    barcode: string;
};

const ReturnItem = async (data: ReturnItemData) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Use the item barcode endpoint to return by item barcode instead of lent item barcode
    const encodedBarcode = encodeURIComponent(data.barcode);
    const END_POINT = `/lentItems/return/item/${encodedBarcode}`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });

    if (res.status === 401) {
        removeToken();
        throw new Error("Unauthorized");
    }

    const responseData = await res.json();
    if (!res.ok) {
        console.error("API Error Response:", responseData);
        const errorMessage = responseData.message || responseData.errors || responseData.title || "Failed to return item";
        throw new Error(errorMessage);
    }
    return responseData.data;
};

export const useReturnItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["returnItem"],
        mutationFn: ReturnItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Item"] });
            queryClient.invalidateQueries({ queryKey: ["lentItems"] });
        },
    });
};
