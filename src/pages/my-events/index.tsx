// Page for repairers to view their assigned events
import { useState } from "react";
import Image from "next/image";

import Box from "@/components/EventBox/Box";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useEvents } from "@/hooks/events";
import { Event } from "@/types";
const Home = () => {
  const [sortKey, setSortKey] = useState<string>("startDate");
  const [searchWord, setSearchWord] = useState<string>("");
  const [sortMethod, setSortMethod] = useState<string>("asc");

  const { data: eventData, isLoading: isEventsLoading } = useEvents(
    sortKey,
    sortMethod,
    searchWord
  );

  // For future use
  // const { userId } = useAuth();

  function formatDate(dateString: string): string {
    const actualDate = new Date(dateString);
    const day = actualDate.getDate().toString().padStart(2, "0");
    const month = (actualDate.getMonth() + 1).toString().padStart(2, "0");
    const year = actualDate.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }

  function createBox(
    id: string,
    name: string,
    startDate: Date,
    endDate: Date,
    description: string,
    location: string
  ) {
    // To do: filter based off users assigned events
    if (name != "Elegant Granite Chair") {
      return (
        <Box
          key={id}
          eventId={id}
          eventTitle={name}
          startDate={formatDate(String(startDate))}
          endDate={formatDate(String(endDate))}
          description={description}
          location={location}
        />
      );
    }
    return null;
  }

  function renderEvents() {
    const events = eventData.map((event: Event) =>
      createBox(
        event.id,
        event.name,
        event.startDate,
        event.endDate,
        event.description,
        event.location
      )
    );

    if (events.filter((value: never) => value != null).length) {
      return (
        <div className="relative flex-row items-center justify-center mb-10">
          <ul id="eventList">{events}</ul>
        </div>
      );
    } else {
      return (
        <div className="relative flex w-full justify-center text-2xl mt-12 text-center text-slate-600 italic font-semibold  text-opacity-90">
          You have no assigned events.
        </div>
      );
    }
  }

  return (
    <div>
      {/* HEADER BAR*/}
      <div className="relative z-10 mt-2 flex w-full justify-center">
        <Image
          src="/images/repair_lab_logo.png"
          alt="Repair Labs Logo"
          width={90}
          height={90}
        />
      </div>
      <h1 className="relative z-10 mt-2 text-xl flex w-full justify-center">
        My Events
      </h1>
      <hr className="mx-10" />

      {/* CONTENT */}
      {isEventsLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        renderEvents()
      )}
    </div>
  );
};

export default Home;
