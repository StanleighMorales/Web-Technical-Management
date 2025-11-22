import { queryOptions } from "@tanstack/react-query";
import { getToken, removeToken } from "../../utils/token";

type StudentDetails = {
    Id: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    StudentIdNumber: string;
    Course: string;
    Section: string;
    Year: string;
    Street: string;
    Province: string;
    PostalCode: string;
    CityMunicipality: string;
    Email: string;
    PhoneNumber: string;
    FrontIdPicture?: string;
    BackIdPicture?: string;
};

const GetStudentByIdNumber = async (studentIdNumber: string): Promise<StudentDetails> => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/users/students/by-id-number/${studentIdNumber}`;

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
        const errorMessage = responseData?.message || responseData?.errors || responseData?.title || "Failed to fetch student";
        throw new Error(errorMessage);
    }

    if (!responseData || !responseData.data) {
        throw new Error("Invalid response structure from server");
    }

    return responseData.data;
};

export const useStudentByIdNumberQuery = (studentIdNumber: string) => {
    return queryOptions({
        queryKey: ["student", "idNumber", studentIdNumber],
        queryFn: () => GetStudentByIdNumber(studentIdNumber),
        enabled: !!studentIdNumber,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};