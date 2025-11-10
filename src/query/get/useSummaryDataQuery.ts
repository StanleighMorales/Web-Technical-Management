import { queryOptions } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";


const SummaryData = async () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/summary`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })

    if (res.status === 401) {
        removeToken();
        return;
    }

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to fetch summary");
    return data.data;
}

export const useSummaryDataQuery = () => {
    return queryOptions({
        queryKey: ["summary"],
        queryFn: SummaryData
    })
}
