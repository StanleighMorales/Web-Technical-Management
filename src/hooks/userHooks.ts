import {
  queryOptions,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import {
  allUsersApi,
  allUsersArchiveApi,
  archiveUserApi,
  deleteUserApi,
  getArchiveUserInfo,
  userLoggedIn,
  resetPasswordUser,
  registerUserApi,
  restoreUserApi,
  updateStudentApi,
  updateTeacherApi,
  updateUserApi,
  importUser,
} from "../api/user_api";

export const useAllUsers = () => {
  return queryOptions({
    queryFn: allUsersApi,
    queryKey: ["users"],
    staleTime: 0, // Changed from 5 minutes to 0 - always fetch fresh data
    gcTime: 5 * 60 * 1000 // Keep in cache for 5 minutes but mark as stale immediately
  });
};

export const useAllUsersArchive = () => {
  return queryOptions({
    queryFn: allUsersArchiveApi,
    queryKey: ["archiveusers"],
    staleTime: 5 * 60 * 1000
  });
};

export const useArchiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveUserApi,
    mutationKey: ["archive"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserApi,
    mutationKey: ["archiveusers"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archiveusers"] });
    },
  });
};

export const useGetArchiveUserInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getArchiveUserInfo(id),
    queryKey: ["ArchiveUsers", id],
    staleTime: 0, // Changed from 5 minutes to 0 - always fetch fresh data
    gcTime: 5 * 60 * 1000 // Keep in cache for 5 minutes but mark as stale immediately
  });
};

export const useLoggedInUser = () => {
  return queryOptions({
    queryFn: userLoggedIn,
    queryKey: ["me"],
    staleTime: 5 * 60 * 1000
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPasswordUser,
    mutationKey: ["change-password"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUserApi,
    mutationKey: ["register"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useRestoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreUserApi,
    mutationKey: ["restore"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archiveusers"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentApi,
    mutationKey: ["profile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherApi,
    mutationKey: ["profile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,
    mutationKey: ["admin-or-staff"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useImportUser = () => {
  const querClient = useQueryClient();
  return useMutation({
    mutationFn: importUser,
    mutationKey: ["students"],
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
