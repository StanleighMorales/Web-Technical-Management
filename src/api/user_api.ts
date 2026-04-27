import { api } from "./axios";
import type {
  TUserFormData,
  TUpdateUsers,
  TUpdateStudent,
  TUpdatePassword,
  TUpdatedTeacher,
} from "../@types/types";

type TUpdateUserApiPayload = {
  id: string;
  data: Omit<TUpdateUsers, "id">;
};

type TUpdateStudentApiPayload = {
  id: string;
  data: Omit<TUpdateStudent, "onClose">;
};

type TUpdateTeacherApiPayload = {
  id?: string;
  data: TUpdatedTeacher;
};

type TUpdateUserPasswordPayload = {
  id?: string;
  data: TUpdatePassword;
};

export const userLoggedIn = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const allUsersApi = async () => {
  const response = await api.get("/users");
  return response.data.data;
};

export const registerUserApi = async (data: TUserFormData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const updateUserApi = async ({ id, data }: TUpdateUserApiPayload) => {
  const response = await api.patch(
    `/users/admin-or-staff/profile/${id}`,
    data,
  );
  return response.data;
};

export const updateStudentApi = async ({
  id,
  data,
}: TUpdateStudentApiPayload) => {
  // Convert data to FormData for multipart/form-data submission
  const formData = new FormData();
  
  // Only include fields that the backend UpdateStudentProfileDto expects
  const allowedFields = [
    'lastName',
    'middleName',
    'firstName',
    'email',
    'studentIdNumber',
    'course',
    'section',
    'year',
    'street',
    'cityMunicipality',
    'province',
    'postalCode',
    'phoneNumber',
    'profilePicture',
    'frontStudentIdPicture',
    'backStudentIdPicture'
  ];
  
  // Append only allowed fields to FormData (skip null/undefined values)
  Object.entries(data).forEach(([key, value]) => {
    if (allowedFields.includes(key) && value !== null && value !== undefined) {
      // Handle file uploads - use type assertion for File check
      const isFile = value && typeof value === 'object' && 'name' in value && 'size' in value && 'type' in value;
      if (isFile) {
        formData.append(key, value as File);
      } else {
        // Convert other values to string
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.patch(
    `/users/students/profile/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateTeacherApi = async ({
  id,
  data,
}: TUpdateTeacherApiPayload) => {
  const response = await api.patch(
    `/users/teachers/profile/${id}`,
    data,
  );
  return response.data;
};

export const allUsersArchiveApi = async () => {
  const response = await api.get("/archiveusers");
  return response.data.data;
};

export const getArchiveUserInfo = async (id: string) => {
  const response = await api.get(`/archiveusers/${id}`);
  return response.data.data;
};

export const archiveUserApi = async (id: string) => {
  const response = await api.delete(`/users/archive/${id}`);
  return response.data;
};

export const restoreUserApi = async (id: string) => {
  const response = await api.delete(`/archiveusers/restore/${id}`);
  return response.data;
};

export const deleteUserApi = async (id: string) => {
  const response = await api.delete(`/archiveusers/${id}`);
  return response.data;
};

export const resetPasswordUser = async ({
  id,
  data,
}: TUpdateUserPasswordPayload) => {
  const response = await api.patch(`/auth/change-password/${id}`, data);
  return response.data;
};

export const importUser = async (formData: FormData) => {
  const response = await api.post("/users/students/import", formData);
  return response.data;
};
