import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { httpClient } from "@/lib/base-http-client";
import { CreateRepairRequest, GeneralRepairAttempt } from "@/types";

export const useRepairRequests = () => {
  const queryFn = async () => {
    const url = "/repair-request";

    const response = await httpClient.get(url);
    return response.data;
  };

  return useQuery({
    queryKey: ["repair-requests"],
    queryFn
  });
};

export const useCreateRepairRequest = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (data: CreateRepairRequest) => {
    const url = "/repair-request";
    await httpClient.post(url, data);
  };

  const onSuccess = () => {
    toast.success("Repair request submitted!");
    queryClient.invalidateQueries({ queryKey: ["repair-requests"] });
  };

  const onError = () => {
    toast.error(`Error occurred while submitting repair request`);
  };

  return useMutation({
    mutationFn,
    onSuccess,
    onError
  });
};

export const useUpdateRepairRequest = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutationFn = async (data: GeneralRepairAttempt) => {
    const url = `/repair-request/${id}`;
    await httpClient.patch(url, data);
  };

  const onSuccess = () => {
    toast.success("Repair request updated!");
    queryClient.invalidateQueries({ queryKey: ["repair-requests"] });
    queryClient.invalidateQueries({ queryKey: [id] });
  };

  const onError = () => {
    toast.error("Error occurred while updating repair request");
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess,
    onError
  });
};
