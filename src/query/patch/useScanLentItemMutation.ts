import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

// Enum values matching backend: Pending=0, Reserved=1, Approved=2, Denied=3, Canceled=4, Borrowed=5, Returned=6
enum LentItemsStatus {
    Pending = 0,
    Reserved = 1,
    Approved = 2,
    Denied = 3,
    Canceled = 4,
    Borrowed = 5,
    Returned = 6
}

type ScanLentItemData = {
    barcode: string;
    lentItemsStatus: keyof typeof LentItemsStatus;
};

const ScanLentItem = async (data: ScanLentItemData) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const encodedBarcode = encodeURIComponent(data.barcode);
    const END_POINT = `/api/${VERSION}/lentItems/scan/${encodedBarcode}`;

    const statusValue = LentItemsStatus[data.lentItemsStatus];
    console.log(`Sending status: ${data.lentItemsStatus} = ${statusValue}`);

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            LentItemsStatus: statusValue
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