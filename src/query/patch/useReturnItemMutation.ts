import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

const ReturnItem = async (lentItemId: string) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Use the lent item ID to return the borrowed item via PATCH
    const END_POINT = `/lentItems/${lentItemId}`;

    console.log("🔄 Attempting to return item:", {
        lentItemId,
        endpoint: `${BASE_URL}${END_POINT}`
    });

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Status: "Returned"
        }),
    });

    console.log("📡 API Response:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: Object.fromEntries(res.headers.entries())
    });

    if (res.status === 401) {
        removeToken();
        throw new Error("Unauthorized");
    }

    if (!res.ok) {
        // Try to parse error response
        let errorMessage = `Failed to return item (HTTP ${res.status})`;
        try {
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const text = await res.text();
                console.log("❌ Error response body:", text);
                if (text) {
                    const errorData = JSON.parse(text);
                    console.error("API Error Response:", errorData);
                    errorMessage = errorData.message || errorData.errors || errorData.title || errorMessage;
                }
            } else {
                // Try to read as text for non-JSON errors
                const text = await res.text();
                console.log("❌ Non-JSON error response:", text);
                if (text) {
                    errorMessage = text;
                }
            }
        } catch (parseError) {
            console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
    }

    // Success response - handle both JSON and empty responses
    try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const text = await res.text();
            console.log("✅ Success response body:", text);
            if (text) {
                const responseData = JSON.parse(text);
                return responseData?.data || responseData;
            }
        }
        // Empty response or non-JSON response is OK for successful return
        console.log("✅ Empty/non-JSON success response");
        return { success: true };
    } catch (parseError) {
        console.warn("Could not parse success response, but operation succeeded:", parseError);
        return { success: true };
    }
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
