import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { httpClient } from "@/lib/base-http-client";
import { User } from "@/types";

export const useRepairers = (eventId: string) => {
  const queryFn = async () => {
    const url = `/event/${eventId}/repairers`;
    const response = await httpClient.get<User[]>(url);

    return response.data;
  };

  return useQuery({
    queryKey: ["repairers", eventId],
    queryFn
  });
};

export const useAddRepairerToEvent = (eventId: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (userIds: string[]) => {
    const url = `/event/${eventId}/repairers`;
    await httpClient.post(url, {
      id: eventId,
      userId: userIds
    });
  };

  const onSuccess = () => {
    toast.success("Repairer(s) added to event!");
    queryClient.invalidateQueries({ queryKey: ["repairers", eventId] });
  };

  const onError = () => {
    toast.error("Error occurred while adding repairer(s) to event");
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess,
    onError
  });
};

export const useRemoveRepairerFromEvent = (eventId: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (userIds: string[]) => {
    const url = `/event/${eventId}/repairers`;
    await httpClient.delete(url, { data: { id: eventId, userId: userIds } });
  };

  const onSuccess = () => {
    toast.success("Repairer(s) removed from event!");
    queryClient.invalidateQueries({ queryKey: ["repairers", eventId] });
  };

  const onError = () => {
    toast.error("Error occurred while removing repairer(s) from the event");
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess,
    onError
  });
};
