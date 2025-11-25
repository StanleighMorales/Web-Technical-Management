import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

type BorrowItemData = {
    itemId: string;
    borrowerFirstName: string;
    borrowerLastName: string;
    borrowerRole: string;
    teacherFirstName: string | null;
    teacherLastName: string | null;
    room: string;
    subjectTimeSchedule: string;
    remarks: string | null;
    studentIdNumber: string | null;
    status?: 'Borrowed' | 'Reserved';
};

const PostBorrowItem = async (formData: BorrowItemData) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/lentItems/guests`;

    const res = await fetch(`${BASE_URL}${END_POINT}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ItemId: formData.itemId,
            BorrowerFirstName: formData.borrowerFirstName,
            BorrowerLastName: formData.borrowerLastName,
            BorrowerRole: formData.borrowerRole,
            TeacherFirstName: formData.teacherFirstName || "",
            TeacherLastName: formData.teacherLastName || "",
            Room: formData.room,
            SubjectTimeSchedule: formData.subjectTimeSchedule,
            Remarks: formData.remarks || "",
            Status: formData.status || "Borrowed",
            StudentIdNumber: formData.studentIdNumber || "",
        }),
    });

    if (res.status === 401) {
        removeToken();
        throw new Error("Unauthorized");
    }

    const data = await res.json();
    if (!res.ok) {
        // Log the full error response for debugging
        console.error("API Error Response:", data);
        const errorMessage = data.message || data.errors || data.title || "Failed to submit borrow request";
        throw new Error(errorMessage);
    }
    return data.data;
};

export const usePostBorrowItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["borrowItem"],
        mutationFn: PostBorrowItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Item"] });
            queryClient.invalidateQueries({ queryKey: ["lentItems"] });
        },
    });
};
