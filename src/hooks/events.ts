import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { httpClient } from "@/lib/base-http-client";
import {
  CreateEvent,
  EventResponse,
  RepairRequestResponse,
  UpdateEvent
} from "@/types";

export interface EventOption {
  id: string;
  name: string;
}

export const useEvent = (eventId: string | undefined) => {
  const queryFn = async () => {
    const url = `/event/${eventId}`;

    const response = await httpClient.get<EventResponse>(url);
    return response.data;
  };

  return useQuery({
    queryKey: [eventId],
    queryFn,
    enabled: eventId != undefined
  });
};

export const useEvents = (
  sortKey: string,
  sortMethod: string,
  searchWord: string
) => {
  const queryFn = async () => {
    const params = new URLSearchParams({
      sortKey,
      sortMethod,
      searchWord
    });

    const url = `/event?${params.toString()}`;

    const response = await httpClient.get<EventResponse[]>(url);
    return response.data;
  };

  return useQuery({
    queryKey: ["events", sortKey, sortMethod, searchWord],
    queryFn
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (data: CreateEvent) => {
    const url = "/event";
    await httpClient.post(url, data);
  };

  const onSuccess = () => {
    toast.success("Event created!");
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const onError = () => {
    toast.error(`Error occurred while creating event`);
  };

  return useMutation({
    mutationFn,
    onSuccess,
    onError
  });
};

export const useUpdateEvent = (eventId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutationFn = async (data: UpdateEvent) => {
    const url = `/event/${eventId}`;
    await httpClient.patch(url, data);
  };

  const onSuccess = () => {
    toast.success("Event updated!");
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: [eventId] });
  };

  const onError = () => {
    toast.error("Error occurred while updating event");
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess,
    onError
  });
};

export const useEventOptions = () => {
  const queryFn = async () => {
    const url = `/event/options`;
    const response = await httpClient.get(url);

    return response.data;
  };

  return useQuery({
    queryKey: ["event-options"],
    queryFn: queryFn
  });
};

export const useRepairRequests = (eventId: string | undefined) => {
  const queryFn = async () => {
    const url = `event/${eventId}/repair-request`;

    const response = await httpClient.get<RepairRequestResponse[]>(url);
    return response.data;
  };

  return useQuery({
    queryKey: ["repair-requests", eventId],
    queryFn,
    enabled: eventId != undefined
  });
};
