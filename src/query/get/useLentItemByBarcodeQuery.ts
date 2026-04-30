import { queryOptions } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

type LentItemDetails = {
    id: string;
    itemId: string;
    itemName: string;
    userId: string;
    borrowerFullName: string;
    borrowerRole: string;
    studentIdNumber?: string;
    room: string;
    subjectTimeSchedule: string;
    lentAt: string;
    returnedAt?: string;
    status: string;
    barcode: string;
    isHiddenFromUser: boolean;
    remarks?: string;
};

const GetLentItemByBarcode = async (barcode: string): Promise<LentItemDetails> => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const encodedBarcode = encodeURIComponent(barcode);
    const END_POINT = `/lentItems/barcode/${encodedBarcode}`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
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
        const errorMessage = responseData?.message || responseData?.errors || responseData?.title || "Failed to fetch lent item";
        throw new Error(errorMessage);
    }

    if (!responseData || !responseData.data) {
        throw new Error("Invalid response structure from server");
    }

    return responseData.data;
};

export const useLentItemByBarcodeQuery = (barcode: string) => {
    return queryOptions({
        queryKey: ["lentItem", "barcode", barcode],
        queryFn: () => GetLentItemByBarcode(barcode),
        enabled: !!barcode && barcode.startsWith("LENT-"),
        retry: false,
        staleTime: 0,
    });
};