import { queryOptions } from "@tanstack/react-query";
import { getToken } from "../../utils/token";


const viewArchivesUsersCredential = async (id: string) => {
    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const VERSION = "v1";
        const END_POINT = `/api/${VERSION}/archiveusers`;

        const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Archives Data not found");

        return data.data;

    } catch (error) {
        console.log(error)
    }
};

export const useViewArchiveUserCredentials = (id: string) => {
    return queryOptions({
        queryKey: ["ArchiveUsers", id],
        queryFn: () => viewArchivesUsersCredential(id),
    });
};
