import { getToken } from "../../utils/token/index.tsx";
import type { TUpdatedTeacher } from "../../types/types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TeacherPatchProps = {
  id: string;
  formData: TUpdatedTeacher
}
const TeacherPatch = async ({ id, formData }: TeacherPatchProps) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const END_POINT = "/api/v1/users/teachers/profile";

    const updateTeacher = JSON.stringify(formData);
    const res = await fetch(`${BASE_URL}${END_POINT}${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: updateTeacher
    })

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Submission failed");

    return data;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export const usePatchTeacherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["profile"],
    mutationFn: TeacherPatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] })
    }
  });
}
