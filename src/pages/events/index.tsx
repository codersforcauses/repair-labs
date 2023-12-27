import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faFilter,
  faFilterCircleXmark,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EventStatus } from "@prisma/client";
import { SubmitHandler } from "react-hook-form";

import EventFormEditButton from "@/components/Button/event-form-edit-button";
import HoverOpacityButton from "@/components/Button/hover-opacity-button";
import EventForm from "@/components/Forms/event-form";
import Modal from "@/components/Modal";
import ProfilePopover from "@/components/ProfilePopover";
import SearchBar, { SearchBarRef } from "@/components/Search/SearchBar";
import {
  DateRangeFilter,
  OptionFilter,
  UserFilter
} from "@/components/Table/filters";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useCreateEvent, useEvents } from "@/hooks/events";
import { FilterType, useTableFilters } from "@/hooks/filters";
import { ItemType, useItemTypes } from "@/hooks/item-types";
import { CreateEvent, EventResponse } from "@/types";

function Table() {
  const router = useRouter();

  function formatDate(dateString: string): string {
    const actualDate = new Date(dateString);
    const day = actualDate.getDate().toString().padStart(2, "0");
    const month = (actualDate.getMonth() + 1).toString().padStart(2, "0");
    const year = actualDate.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }
  const { mutate: createEvent } = useCreateEvent();

  const { data: itemTypes, isLoading: isItemTypesLoading } = useItemTypes();

  // The label is what users see, the key is what the server uses
  const headers: {
    key: string;
    label: string;
    filterType?: FilterType;
    filterOptions?: string[];
  }[] = useMemo(
    () => [
      { key: "name", label: "Event Name" },
      { key: "createdBy", label: "Created By", filterType: "user" },
      { key: "location", label: "Location" },
      { key: "startDate", label: "Date", filterType: "daterange" },
      {
        key: "eventType",
        label: "Type",
        filterType: "option",
        filterOptions: (itemTypes as ItemType[])?.map((v) => v.name)
      },
      {
        key: "status",
        label: "Status",
        filterType: "option",
        filterOptions: Object.values(EventStatus)
      }
    ],
    [itemTypes]
  );

  const filters = useMemo(
    () =>
      headers
        .filter((h) => h.filterType)
        .map((h) => ({
          columnKey: h.key,
          filterType: h.filterType as FilterType, // TS cannot figure out that its not null
          filterOptions: h.filterOptions
        })),
    [headers]
  );
  // Filtering
  const { columnFilters, updateColumnFilter, resetFilters, isFilterActive } =
    useTableFilters(filters, true);
  const [openFilterMenu, setOpenFilterMenu] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("startDate");
  const [searchWord, setSearchWord] = useState<string>("");
  const searchBarRef = useRef<SearchBarRef>(null);
  const [sortMethod, setSortMethod] = useState<"asc" | "desc">("asc");
  const { data: eventData, isLoading: isEventsLoading } = useEvents(
    sortKey,
    sortMethod,
    searchWord,
    // TODO: find way to shorten this
    columnFilters["startDate"]?.type == "daterange"
      ? columnFilters["startDate"]?.filter
      : undefined,
    columnFilters["eventType"]?.type == "option"
      ? columnFilters["eventType"]?.filter
      : undefined,
    columnFilters["status"]?.type == "option"
      ? columnFilters["status"]?.filter
      : undefined,
    columnFilters["createdBy"]?.type == "user"
      ? columnFilters["createdBy"]?.filter.map((u) => u.id)
      : undefined
  );

  // will toggle modal visibility for editing events
  const [showAddModal, setShowAddModal] = useState(false);

  function handleButtonClick(key: string) {
    // If the clicked column is already the sort key, toggle the sort method
    if (sortKey === key) {
      setSortMethod(sortMethod === "asc" ? "desc" : "asc");
    } else {
      // If it's a new column, set it as the sort key with ascending order
      setSortKey(key);
      setSortMethod("asc");
    }
  }
  function ToggleChevron(column: string) {
    const isActive = sortKey === column;
    const icon = isActive
      ? sortMethod === "asc"
        ? faChevronUp
        : faChevronDown
      : faChevronRight;

    return (
      <HoverOpacityButton onClick={() => handleButtonClick(column)}>
        <FontAwesomeIcon icon={icon} />
      </HoverOpacityButton>
    );
  }
  function FilterButton(
    column: string,
    filterType?: FilterType,
    options?: string[]
  ) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    if (!filterType) return null;

    const onFilterClose = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as HTMLDivElement)
      )
        setOpenFilterMenu("");
    };

    const filter = columnFilters[column];
    if (!filter) return null;

    const getFilterPicker = () => {
      switch (filter.type) {
        case "daterange":
          return (
            <DateRangeFilter
              minDate={filter.filter.minDate}
              maxDate={filter.filter.maxDate}
              onFilterChange={(minDate, maxDate) =>
                updateColumnFilter(column, { minDate, maxDate })
              }
              onClose={onFilterClose}
            />
          );
        case "user":
          return (
            <UserFilter
              selectedUsers={filter.filter}
              onFilterChange={(users) => updateColumnFilter(column, users)}
              onClose={onFilterClose}
            />
          );
        default:
          return (
            <OptionFilter
              options={options ?? []}
              selectedOptions={filter.filter}
              onFilterChange={(options) => updateColumnFilter(column, options)}
              onClose={onFilterClose}
            />
          );
      }
    };

    return (
      <>
        <HoverOpacityButton
          ref={buttonRef}
          className={isFilterActive(column) ? "text-lightAqua-500" : ""}
          onClick={() =>
            setOpenFilterMenu((prev) => (prev === column ? "" : column))
          }
        >
          <FontAwesomeIcon icon={faFilter} />
        </HoverOpacityButton>
        {openFilterMenu === column && getFilterPicker()}
      </>
    );
  }

  const submitCreateEvent: SubmitHandler<CreateEvent> = async (data) => {
    createEvent(data, {
      onSuccess: () => {
        setShowAddModal(false);
      }
    });
  };
  return (
    <div>
      {/* HEADER BAR*/}
      <div className=" flex w-full flex-row border-b-[2px] border-slate-300 ">
        <Image
          className="m-10 mb-5 mt-5"
          src="/images/repair_lab_logo.jpg"
          alt="logo"
          width="90"
          height="90"
        />
        <h1 className="mt-[50px] text-3xl font-semibold text-slate-600">
          {" "}
          Event Listings
        </h1>

        {/* ACCOUNT AREA*/}
        <div className="absolute right-10 self-center justify-self-end">
          {/* Profile Pop Over */}
          <ProfilePopover />
        </div>
      </div>

      <div className="flex justify-center">
        {/* Clear filter button */}
        <div className="p-4 text-center ">
          <HoverOpacityButton
            className="h-10 w-10 rounded-full bg-gray-100 text-gray-500"
            title="Clear Filters"
            onClick={() => {
              resetFilters();
              searchBarRef.current?.clearSearch();
            }}
          >
            <FontAwesomeIcon
              icon={faFilterCircleXmark}
              className="text-[1rem] transform translate-y-[2px]"
            />
          </HoverOpacityButton>
        </div>

        {/* Search bar above table */}
        <SearchBar
          className="w-5/12 p-4"
          onSearchChange={(text) => setSearchWord(text)}
          saveInURL={true}
          ref={searchBarRef}
        />

        {/* Add event button*/}
        <div className=" p-4 text-center ">
          <HoverOpacityButton
            className="h-10 w-10 rounded-full bg-gray-100 text-gray-500 focus:shadow-md"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </HoverOpacityButton>
          <Modal
            setShowPopup={setShowAddModal}
            showModal={showAddModal}
            height="h-3/4"
          >
            <EventForm itemTypes={itemTypes} onSubmit={submitCreateEvent} />
          </Modal>
        </div>
      </div>

      {/* main table*/}
      <div
        className={`flex justify-center ${
          isItemTypesLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="container block w-full justify-center">
          <table className="w-10/12 table-auto m-auto">
            <thead>
              <tr className="border-b pb-10 text-left ">
                {headers.map((col) => (
                  <th
                    key={col.key}
                    className="p-2.5 pl-5 font-normal relative bg-lightAqua-200 first:rounded-tl-lg"
                  >
                    {" "}
                    {col.label} {ToggleChevron(col.key)}{" "}
                    {FilterButton(col.key, col.filterType, col.filterOptions)}
                  </th>
                ))}
                <th className="w-10 p-2.5 text-justify font-normal bg-lightAqua-200 last:rounded-tr-lg">
                  Edit
                </th>
              </tr>
            </thead>

            <tbody className="bg-secondary-50">
              {eventData &&
                eventData.map((event: EventResponse) => {
                  return (
                    <tr
                      key={event.name}
                      className="first:ml-50 border-b p-2.5 last:mr-10 even:bg-slate-100 hover:bg-slate-200"
                    >
                      <td className="pl-5 font-light">
                        <button
                          className="text-sm"
                          onClick={() =>
                            router.push(
                              "/events/" + event.id + "/repair-requests"
                            )
                          }
                        >
                          {event.name}
                        </button>
                      </td>
                      <td className="p-2.5 text-sm font-light">
                        {event.createdBy.firstName} {event.createdBy.lastName}
                      </td>
                      <td className="text-sm font-light">{event.location}</td>
                      <td className="text-sm font-light">
                        {formatDate(String(event.startDate))}
                      </td>
                      <td className="text-sm font-light">{event.eventType}</td>
                      <td className="text-sm font-light">{event.status}</td>
                      <td className="align-center ml-0 p-2.5 pl-0 text-center">
                        <EventFormEditButton props={event} />
                      </td>
                    </tr>
                  );
                })}
              {isEventsLoading && (
                <tr className=" h-40">
                  <td colSpan={headers.length + 1}>
                    <div className="w-full h-full flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
