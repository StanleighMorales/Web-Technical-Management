import { getToken, removeToken } from "../../utils/token/index.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TUpdatedStudentData = {
  firstName: string;
  middleName: string;
  lastName: string;
  studentIdNumber: string;
  course: string;
  section: string;
  year: string;
  phoneNumber: string;
  street: string;
  cityMunicipality: string;
  province: string;
  postalCode: string;
  username: string;
  email: string;
  userRole: string;
  status: string;
}

type StudentPatchProps = {
  id: string;
  formData: TUpdatedStudentData
}
const StudentPatch = async ({ id, formData }: StudentPatchProps) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const VERSION = "v1";
    const END_POINT = `/api/${VERSION}/users/students/profile`;

    const formDataObj = new FormData();
    formDataObj.append('FirstName', formData.firstName);
    formDataObj.append('MiddleName', formData.middleName);
    formDataObj.append('LastName', formData.lastName);
    formDataObj.append('StudentIdNumber', formData.studentIdNumber);
    formDataObj.append('Course', formData.course);
    formDataObj.append('Section', formData.section);
    formDataObj.append('Year', formData.year);
    formDataObj.append('PhoneNumber', formData.phoneNumber);
    formDataObj.append('Street', formData.street);
    formDataObj.append('CityMunicipality', formData.cityMunicipality);
    formDataObj.append('Province', formData.province);
    formDataObj.append('PostalCode', formData.postalCode);
    formDataObj.append('username', formData.username);
    formDataObj.append('Email', formData.email);
    formDataObj.append('UserRole', formData.userRole);
    formDataObj.append('Status', formData.status);

    const res = await fetch(`${BASE_URL}${END_POINT}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formDataObj
    })

    if (res.status === 401) {
      removeToken();
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Submission failed");

    return data;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export const usePatchStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["profile"],
    mutationFn: StudentPatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    }
  });
}
