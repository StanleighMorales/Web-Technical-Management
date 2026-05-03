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
  blockUserApi,
  unblockUserApi,
  createStudentRfidSessionApi,
  getStudentRfidSessionApi,
  cancelStudentRfidSessionApi,
} from "../api/user_api";

export const useAllUsers = () => {
  return queryOptions({
    queryFn: allUsersApi,
    queryKey: ["users"],
    staleTime: 0,
    gcTime: 5 * 60 * 1000 
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
    staleTime: 0, 
    gcTime: 5 * 60 * 1000
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherApi,
    mutationKey: ["profile"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { reason: string; isPermanent: boolean; blockedUntil?: string } }) =>
      blockUserApi(id, data),
    mutationKey: ["block-user"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUserApi,
    mutationKey: ["unblock-user"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useCreateStudentRfidSession = () => {
  return useMutation({
    mutationFn: createStudentRfidSessionApi,
    mutationKey: ["studentRfidSession"],
  });
};

export const useGetStudentRfidSession = (sessionId: string) => {
  return queryOptions({
    queryFn: () => getStudentRfidSessionApi(sessionId),
    queryKey: ["studentRfidSession", sessionId],
    enabled: !!sessionId,
    staleTime: 0,
    refetchInterval: 2000,
  });
};

export const useCancelStudentRfidSession = () => {
  return useMutation({
    mutationFn: cancelStudentRfidSessionApi,
    mutationKey: ["studentRfidSession"],
  });
};
