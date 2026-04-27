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
  const form = new FormData();

  form.append("FirstName", data.firstName);
  form.append("MiddleName", data.middleName);
  form.append("LastName", data.lastName);
  form.append("StudentIdNumber", data.studentIdNumber);
  form.append("PhoneNumber", data.phoneNumber);
  form.append("Course", data.course);
  form.append("Section", data.section);
  form.append("Year", data.year);
  form.append("Street", data.street);
  form.append("CityMunicipality", data.cityMunicipality);
  form.append("Province", data.province);
  form.append("PostalCode", data.postalCode);
  form.append("Username", data.username);
  form.append("Email", data.email);

  if (data.frontStudentIdPicture instanceof File) {
    form.append("FrontStudentIdPicture", data.frontStudentIdPicture);
  }
  if (data.backStudentIdPicture instanceof File) {
    form.append("BackStudentIdPicture", data.backStudentIdPicture);
  }
  if (data.profilePicture instanceof File) {
    form.append("ProfilePicture", data.profilePicture);
  }

  const response = await api.patch(`/users/students/profile/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

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
