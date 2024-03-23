import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { httpClient } from "@/lib/base-http-client";
import { PaginationOptions, PaginationResponse } from "@/lib/pagination";
import { EventRepairer } from "@/pages/api/event/[id]/repairers";
import {
  CreateEvent,
  EventResponse,
  RepairRequestResponse,
  SortDirection,
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
  params: {
    sortKey?: string;
    sortMethod?: string;
    searchWord?: string;
    minDate?: string;
    maxDate?: string;
    eventType?: string[];
    eventStatus?: string[];
    createdBy?: string[];
  } & PaginationOptions
) => {
  return useQuery<PaginationResponse<EventResponse[]>>({
    queryKey: ["events", params],
    queryFn: () =>
      httpClient
        .get("/event", {
          params
        })
        .then((response) => response.data),
    placeholderData: (pre) => pre
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

export const useRepairRequests = (params: {
  // Filtering
  eventId?: string;
  sortKey?: string;
  sortMethod?: SortDirection;
  searchWord?: string;
  assignedTo?: string;
  itemType?: string;
  // Pagination
  page?: number;
  perPage?: number;
}) => {
  return useQuery<PaginationResponse<RepairRequestResponse[]>>({
    queryKey: ["repair-requests", params],
    placeholderData: keepPreviousData,
    queryFn: () =>
      httpClient
        .get(`event/${params.eventId}/repair-request`, {
          params
        })
        .then((response) => response.data),
    enabled: params.eventId != undefined
  });
};

export const useRepairers = (eventId: string | undefined) => {
  const queryFn = async () => {
    const url = `event/${eventId}/repairers`;

    const response = await httpClient.get<EventRepairer[]>(url);
    return response.data;
  };

  return useQuery({
    queryKey: ["repairers", eventId],
    queryFn,
    enabled: !!eventId
  });
};
