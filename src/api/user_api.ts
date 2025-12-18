import { api } from "./axios";
import type {
  TRegisterUser,
  TUpdateUsers,
  TUpdateStudent,
  TUpdatePassword,
  TUpdatedTeacher,
} from "../types/types";

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
  const response = await api.get("/api/v1/auth/me");
  return response.data.data;
};

export const allUsersApi = async () => {
  const response = await api.get("/api/v1/users");
  return response.data.data;
};

export const registerUserApi = async (data: TRegisterUser) => {
  const response = await api.post("/api/v1/auth/register", data);
  return response.data;
};

export const updateUserApi = async ({ id, data }: TUpdateUserApiPayload) => {
  const response = await api.patch(
    `/api/v1/users/admin-or-staff/profile/${id}`,
    data,
  );
  return response.data;
};

export const updateStudentApi = async ({
  id,
  data,
}: TUpdateStudentApiPayload) => {
  const response = await api.patch(
    `/api/v1/users/students/profile/${id}`,
    data,
  );
  return response.data;
};

export const updateTeacherApi = async ({
  id,
  data,
}: TUpdateTeacherApiPayload) => {
  const response = await api.patch(
    `/api/v1/users/teachers/profile/${id}`,
    data,
  );
  return response.data;
};

export const allUsersArchiveApi = async () => {
  const response = await api.get("/api/v1/archiveusers");
  return response.data.data;
};

export const getArchiveUserInfo = async (id: string) => {
  const response = await api.get(`/api/v1/archiveusers/${id}`);
  return response.data.data;
};

export const archiveUserApi = async (id: string) => {
  const response = await api.delete(`/api/v1/users/archive/${id}`);
  return response.data;
};

export const restoreUserApi = async (id: string) => {
  const response = await api.delete(`/api/v1/archiveusers/restore/${id}`);
  return response.data;
};

export const deleteUserApi = async (id: string) => {
  const response = await api.delete(`/api/v1/archiveusers/${id}`);
  return response.data;
};

export const resetPasswordUser = async ({
  id,
  data,
}: TUpdateUserPasswordPayload) => {
  const response = await api.patch(`/api/v1/auth/change-password/${id}`, data);
  return response.data;
};
