import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

type ScanLentItemData = {
    barcode: string;
    lentItemsStatus: string;
};

const ScanLentItem = async (data: ScanLentItemData) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/lentItems/scan/${data.barcode}`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            lentItemsStatus: data.lentItemsStatus
        }),
    });

    if (res.status === 401) {
        removeToken();
        throw new Error("Unauthorized");
    }

    // Check if response has JSON content
    const contentType = res.headers.get("content-type");
    const hasJsonContent = contentType && contentType.includes("application/json");

    if (!hasJsonContent) {
        const textResponse = await res.text();
        throw new Error(`Invalid response format: ${textResponse || `HTTP ${res.status}`}`);
    }

    let responseData;
    try {
        responseData = await res.json();
    } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Invalid JSON response from server");
    }

    if (!res.ok) {
        console.error("API Error Response:", responseData);
        const errorMessage = responseData?.message || responseData?.errors || responseData?.title || "Failed to scan lent item";
        throw new Error(errorMessage);
    }

    return responseData?.data || null;
};

export const useScanLentItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["scanLentItem"],
        mutationFn: ScanLentItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lentItems"] });
            queryClient.invalidateQueries({ queryKey: ["Item"] });
        },
    });
};