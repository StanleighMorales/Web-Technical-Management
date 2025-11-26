import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TUserFormData } from "../../types/types";
import { getToken, removeToken } from "../../utils/token";

const PostUser = async (formData: TUserFormData) => {

    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const VERSION = "v1";
        const END_POINT = `/api/${VERSION}/auth/register`;

        const newUserData = JSON.stringify(formData)
        const res = await fetch(`${BASE_URL}${END_POINT}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            },
            body: newUserData,
        });

        if (res.status === 401) {
            removeToken();
            return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.message;

    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
};

export const usePostUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["register"],
        mutationFn: PostUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    });
};
