import { getToken, removeToken } from "../../utils/token/index.tsx";
import type { TUpdatedTeacher } from "../../types/types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TeacherPatchProps = {
    id: string;
    formData: TUpdatedTeacher;
};
const TeacherPatch = async ({ id, formData }: TeacherPatchProps) => {
    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const VERSION = "v1";
        const END_POINT = `/api/${VERSION}/users/teachers/profile`;

        const updateTeacher = JSON.stringify(formData);
        const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: updateTeacher,
        });

        if (res.status === 401) {
            removeToken();
            return;
        }

        if (res.status === 404) {
            throw new Error("Submission failed");
        }

        const data = await res.json();

        return data.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

export const usePatchTeacherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["profile"],
        mutationFn: TeacherPatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};
