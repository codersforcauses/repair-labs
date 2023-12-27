import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { httpClient } from "@/lib/base-http-client";
import { User } from "@/types";

export type FilterType = "daterange" | "option" | "user";

export type DateFilterData = { minDate: string; maxDate: string };

type UserFilter = {
  type: "user";
  filter: User[];
};
type DateFilter = {
  type: "daterange";
  filter: DateFilterData;
};
type OptionFilter = {
  type: "option";
  filter: string[];
  options: string[];
};

type Filter = UserFilter | DateFilter | OptionFilter;

export const useTableFilters = (
  filters: {
    columnKey: string;
    filterType: FilterType;
    filterOptions?: string[];
  }[],
  saveInURL: boolean = false
) => {
  const userCache = useRef<Partial<Record<string, User>>>();
  // next router does not like frequent updates, using window.location

  const initialiseUserFilter = (columnKey: string): UserFilter => {
    const searchParams = new URLSearchParams(window.location.search);
    const savedState = saveInURL ? searchParams.get(columnKey) : null;
    return {
      type: "user",
      filter:
        savedState != null
          ? savedState
              .split(",")
              .map((userId) => userCache.current?.[userId])
              .filter((u): u is User => u !== undefined)
          : []
    };
  };

  const initialiseDateFilter = (columnKey: string): DateFilter => {
    const searchParams = new URLSearchParams(window.location.search);
    const getValue = (suffix: string) =>
      saveInURL
        ? dateOrNull(searchParams.get(`${columnKey}-${suffix}`)) ?? ""
        : "";

    const min = getValue("min");
    const max = getValue("max");

    return { type: "daterange", filter: { minDate: min, maxDate: max } };
  };

  const initialiseOptionFilter = (
    columnKey: string,
    filterOptions: string[]
  ): OptionFilter => {
    const searchParams = new URLSearchParams(window.location.search);
    const savedState = saveInURL ? searchParams.get(columnKey) : null;
    const initial =
      savedState != null
        ? // Ensure URL has actual options
          savedState.split(",").filter((i) => filterOptions?.includes(i))
        : filterOptions;

    return {
      type: "option",
      filter: initial || [],
      options: filterOptions || []
    };
  };

  const initialise = () =>
    filters.reduce(
      (acc, { columnKey, filterType, filterOptions }) => {
        const initialiserMap = {
          user: initialiseUserFilter,
          daterange: initialiseDateFilter,
          option: () => initialiseOptionFilter(columnKey, filterOptions ?? [])
        };

        acc[columnKey] = initialiserMap[filterType]?.(columnKey);

        return acc;
      },
      {} as Partial<Record<string, Filter>>
    );

  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<string, Filter>>
  >({});

  const initialiseFilters = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const userIds: string[] = [];
    filters.forEach((filter) => {
      const urlVal = searchParams.get(filter.columnKey);
      if (urlVal && filter.filterType === "user")
        userIds.push(...urlVal.split(","));
    });
    // If we have users to fetch, fetch them first and then initialise, otherwise just initialise
    if (userIds.length > 0) {
      const fetchUsers = async () => {
        // todo: react query
        const users = (
          await httpClient.get<User[]>(`/user/list?ids=${userIds.join(",")}`)
        ).data;
        userCache.current = users.reduce(
          (map, user) => {
            map[user.id] = user;
            return map;
          },
          {} as Partial<Record<string, User>>
        );
        setColumnFilters(initialise);
      };
      fetchUsers();
    } else setColumnFilters(initialise);
  };

  useEffect(() => {
    initialiseFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const updateURL = (newFilters: Partial<Record<string, Filter>>) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!saveInURL) return;
    const params = new URLSearchParams(searchParams);
    for (const key in newFilters) {
      const value = newFilters[key];
      if (!value) continue;
      params.delete(key);
      // SAVE USER IDS IN URL
      if (value.type == "user" && value.filter.length > 0) {
        params.append(key, value.filter.map((user) => user.id).join(","));
      }
      // SAVE OPTIONS IN URL
      else if (
        value.type == "option" &&
        value.filter.length != value.options.length
      ) {
        params.append(key, value.filter.join(","));
      }
      // SAVE DATES IN URL
      else if (value.type == "daterange") {
        if (value.filter.minDate)
          params.append(`${key}-min`, value.filter.minDate);
        if (value.filter.maxDate)
          params.append(`${key}-max`, value.filter.maxDate);
      }
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
  };

  function updateColumnFilter(
    column: string,
    newFilter: User[] | DateFilterData | string[]
  ) {
    setColumnFilters((currentFilters) => {
      const newFilters = { ...currentFilters };
      const existing = newFilters[column];

      if (existing) {
        if (Array.isArray(existing.filter) && Array.isArray(newFilter)) {
          existing.filter = newFilter;
        } else if (
          typeof existing.filter === "object" &&
          "minDate" in existing.filter &&
          "maxDate" in existing.filter &&
          typeof newFilter === "object" &&
          "minDate" in newFilter &&
          "maxDate" in newFilter
        ) {
          existing.filter = newFilter;
        } else {
          throw new Error("Filter type mismatch");
        }

        newFilters[column] = existing;
      }
      updateURL(newFilters);
      return newFilters;
    });
  }

  const resetFilters = () => {
    setColumnFilters((currentFilters) => {
      const newFilters = Object.entries(currentFilters).reduce<
        Partial<Record<string, Filter>>
      >((acc, cur) => {
        const newFilter = cur[1];
        if (!newFilter) return acc;

        if (newFilter.type === "user") newFilter.filter = [];
        else if (newFilter.type === "daterange")
          newFilter.filter = { minDate: "", maxDate: "" };
        else if (newFilter.type === "option")
          newFilter.filter = [...newFilter.options];
        acc[cur[0]] = newFilter;
        return acc;
      }, {});
      updateURL(newFilters);
      return newFilters;
    });
  };

  const isFilterActive = (column: string): boolean | undefined => {
    const filter = columnFilters?.[column];
    if (!filter) return;

    switch (filter.type) {
      case "daterange":
        return (
          filter.filter.minDate.length !== 0 ||
          filter.filter.maxDate.length !== 0
        );
      case "user":
        return filter.filter.length !== 0;
      default:
        return !filter.options.every((element) =>
          filter.filter.includes(element)
        );
    }
  };

  return {
    columnFilters,
    updateColumnFilter,
    resetFilters,
    isFilterActive
  };
};

const dateOrNull = (value: string | null) => {
  try {
    return value ? z.string().datetime().parse(value) : undefined;
  } catch {
    return undefined;
  }
};
