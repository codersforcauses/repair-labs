import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { httpClient } from "@/lib/base-http-client";
import { UserResponse, UserRole } from "@/types";

export const useUsers = (
  perPage: number,
  page: number,
  orderBy: string,
  query: string
) => {
  const queryFn = async () => {
    const params = new URLSearchParams({
      perPage: perPage.toString(),
      page: page.toString(),
      orderBy,
      query
    });

    const url = `/user?${params.toString()}`;

    const response = await httpClient.get<UserResponse>(url);

    return response.data;
  };

  return useQuery({
    queryKey: ["users", perPage, page, orderBy, query],
    queryFn: queryFn
  });
};

export const useUserRole = (userId: string | undefined) => {
  const queryFn = async () => {
    const url = `/user/${userId}/role`;

    const response = await httpClient.get<{ role: UserRole }>(url);

    return response.data.role;
  };

  return useQuery({
    queryKey: ["users", "role", userId],
    queryFn: queryFn,
    staleTime: 60 * (60 * 1000), // 1 hr
    gcTime: 65 * (60 * 1000), // 1 hr and 5 mins
    enabled: !!userId
  });
};

export const useUpdateUserRole = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutationFn = async (role: UserRole) => {
    const url = `/user/${userId}/role`;
    await httpClient.patch(url, { role });
  };

  const onSuccess = () => {
    toast.success("User updated!");
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: [userId] });
  };

  const onError = () => {
    toast.error("Error occurred while updating user");
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess,
    onError
  });
};
