import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SubmitHandler } from "react-hook-form";

import EventFormEditButton from "@/components/Button/event-form-edit-button";
import EventForm from "@/components/Forms/event-form";
import Modal from "@/components/Modal";
import ProfilePopover from "@/components/ProfilePopover";
import { useCreateEvent, useEvents } from "@/hooks/events";
import { useItemTypes } from "@/hooks/item-types";
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

  const [sortKey, setSortKey] = useState<string>("startDate");
  const [searchWord, setSearchWord] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<string>("asc");
  const [expandedButton, setExpandedButton] = useState<string>("");

  const { mutate: createEvent } = useCreateEvent();
  const { data: eventData, isLoading: isEventsLoading } = useEvents(
    sortKey,
    sortMethod,
    searchWord
  );
  const { data: itemTypes } = useItemTypes();

  // The label is what users see, the key is what the server uses
  const headers: { key: string; label: string }[] = [
    { key: "name", label: "Event Name" },
    { key: "createdBy", label: "Created By" },
    { key: "location", label: "Location" },
    { key: "startDate", label: "Date" },
    { key: "eventType", label: "Type" },
    { key: "status", label: "Status" }
  ];

  // will toggle modal visibility for editing events
  const [showAddModal, setShowAddModal] = useState(false);

  function handleButtonClick(key: string) {
    if (expandedButton === key) {
      setExpandedButton("");
    } else {
      setExpandedButton(key);
    }

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
    return (
      <button onClick={() => handleButtonClick(column)}>
        {" "}
        {column === expandedButton ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )}
      </button>
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

      {/* Search bar above table */}
      <div className="flex justify-center">
        <div className="relative w-5/12 p-4">
          <input
            className="h-10 w-full rounded-3xl border-none bg-gray-100 bg-gray-200 px-5 py-2 text-sm focus:shadow-md focus:outline-none "
            type="search"
            name="search"
            placeholder="Search"
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <button className="absolute right-8 top-2/4 -translate-y-2/4 transform cursor-pointer text-gray-500">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Add event button*/}
        <div className=" p-4 text-center ">
          <button
            className="h-10 w-10 rounded-full bg-gray-200 text-gray-500 focus:shadow-md"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <Modal
            setShowPopup={setShowAddModal}
            showModal={showAddModal}
            height="h-3/4"
          >
            <EventForm
              itemTypes={itemTypes ?? []}
              onSubmit={submitCreateEvent}
            />
          </Modal>
        </div>
      </div>

      {/* main table*/}
      <div className="flex justify-center">
        <div className="container flex w-full justify-center overflow-hidden">
          {isEventsLoading ? (
            "Loading..."
          ) : (
            <table className="w-10/12 table-auto overflow-hidden rounded-lg">
              <thead>
                <tr className="border-b bg-lightAqua-200 pb-10 text-left ">
                  {headers.map((col) => (
                    <th key={col.key} className="p-2.5 pl-5 font-normal">
                      {" "}
                      {col.label} {ToggleChevron(col.key)}{" "}
                    </th>
                  ))}
                  <th className="w-10 p-2.5 text-justify font-normal">
                    {" "}
                    Edit{" "}
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
                        <td className="text-sm font-light">
                          {event.eventType}
                        </td>
                        <td className="text-sm font-light">{event.status}</td>
                        <td className="align-center ml-0 p-2.5 pl-0 text-center">
                          <EventFormEditButton props={event} />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
