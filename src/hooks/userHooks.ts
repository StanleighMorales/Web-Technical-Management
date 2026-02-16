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
    staleTime: 1000 * 60
  });
};

export const useAllUsersArchive = () => {
  return queryOptions({
    queryFn: allUsersArchiveApi,
    queryKey: ["archiveusers"],
    staleTime: 1000 * 60
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
    onError: (error) => {
      console.log(error.message);
    },
  });
};

export const useGetArchiveUserInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getArchiveUserInfo(id),
    queryKey: ["ArchiveUsers", id],
    staleTime: 1000 * 60
  });
};

export const useLoggedInUser = () => {
  return queryOptions({
    queryFn: userLoggedIn,
    queryKey: ["me"],
    staleTime: 1000 * 60
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
    onError: (error) => {
      console.log(error.message);
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
    onError: (error: any) => {
      if (error.response) console.log(error.response.data.Errors);
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
    onError: (error) => {
      console.log(error.message);
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
    onError: (error) => {
      console.log(error);
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
