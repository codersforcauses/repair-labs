import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CiCirclePlus } from "react-icons/ci";

import AssigneeBadge from "@/components/Cards/assignee-badge";
import Header, { HeaderProps } from "@/components/Header";
import Sidebar from "@/components/sidebar/index";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useEvent } from "@/hooks/events";
import { User } from "@/types";

export default function Volunteers() {
  const [volunteers, _setVolunteers] = useState<User[]>([]);
  const [headerValues, setHeaderValues] = useState<HeaderProps>();
  const {
    query: { id: eventId }
  } = useRouter();

  const { data: event } = useEvent(eventId as string);

  useEffect(() => {
    if (!event) return;
    setHeaderValues({
      name: event.name,
      location: event.location,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdBy: event.createdBy
    });
    // setVolunteers(event.eventRepairer); // TODO: issue 109: GET endpoint to get repairers for an event
  }, [event]);

  return (
    <Sidebar>
      <main className="ml-80 min-h-screen w-full p-4">
        {headerValues ? (
          <>
            <Header {...headerValues} />
            <div className="container">
              <div className="w-auto p-4 text-2xl font-bold text-zinc-400">
                <span>Volunteers ({volunteers.length})</span>
              </div>
              <div className="container mx-auto">
                <div className="flex justify-end"></div>
              </div>
              <div className="grid gap-4 p-4 lg:grid-cols-5 ">
                {volunteers.map((item) => (
                  <div key={item.id}>
                    <AssigneeBadge
                      firstName={item.firstName ?? item.emailAddress}
                      lastName={item.lastName ?? ""}
                    />
                  </div>
                ))}
                <div
                  className="flex w-full items-center justify-center rounded-lg border bg-grey-100 p-4 shadow-md transition hover:-translate-y-1 hover:cursor-pointer hover:bg-secondary-50"
                  role="presentation"
                >
                  <CiCirclePlus color="rgb(82 82 91)" size={100} />
                </div>
              </div>
              <span className="w-full border-b-[1px] border-gray-200 p-2"></span>
            </div>
          </>
        ) : (
          <LoadingSpinner className="w-full h-full flex items-center justify-center " />
        )}
      </main>
    </Sidebar>
  );
}
