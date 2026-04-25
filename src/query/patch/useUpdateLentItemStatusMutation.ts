import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

// Valid status strings matching backend LentItemsStatus enum
type LentItemsStatusString =
    | "Pending"
    | "Reserved"
    | "Approved"
    | "Denied"
    | "Canceled"
    | "Borrowed"
    | "Returned"
    | "Expired";

type UpdateLentItemStatusData = {
    id: string;
    lentItemsStatus: LentItemsStatusString;
};

const updateLentItemStatus = async (data: UpdateLentItemStatusData) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const END_POINT = `/lentItems/${data.id}`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // Backend UpdateLentItemDto expects "Status" as a string (e.g. "Approved", "Denied")
            Status: data.lentItemsStatus,
        }),
    });

    if (res.status === 401) {
        removeToken();
        throw new Error("Unauthorized");
    }

    const contentType = res.headers.get("content-type");
    const hasJsonContent = contentType && contentType.includes("application/json");

    if (!hasJsonContent) {
        const textResponse = await res.text();
        throw new Error(`Invalid response format: ${textResponse || `HTTP ${res.status}`}`);
    }

    let responseData;
    try {
        responseData = await res.json();
    } catch {
        throw new Error("Invalid JSON response from server");
    }

    if (!res.ok) {
        const errorMessage =
            responseData?.message ||
            responseData?.errors ||
            responseData?.title ||
            "Failed to update lent item status";
        throw new Error(errorMessage);
    }

    return responseData?.data ?? null;
};

export const useUpdateLentItemStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["updateLentItemStatus"],
        mutationFn: updateLentItemStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lentItems"] });
            queryClient.invalidateQueries({ queryKey: ["items"] });
        },
    });
};
