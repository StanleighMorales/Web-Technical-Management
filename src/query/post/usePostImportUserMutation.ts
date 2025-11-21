import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../utils/token";

const importUsers = async (formData: FormData) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/users/students/import`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.Errors || "Submission failed");
    return data;
};

export const usePostImportExcelUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["import"],
        mutationFn: importUsers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] })
        }
    });
}
