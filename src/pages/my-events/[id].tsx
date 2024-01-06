// Page for repairers to view the repair requests associated with
// a given event. This page is accessed via the my-events page.
import { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";

import RequestView from "@/components/EventBox/Request-view";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useEvent } from "@/hooks/events";
import { useRepairRequests } from "@/hooks/events";

const Home = () => {
  const {
    query: { id: eventId }
  } = useRouter();

  const { isLoading, data: repairRequests } = useRepairRequests(
    eventId as string
  );
  const { data: event } = useEvent(eventId as string);

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
        {event ? event.name : <LoadingSpinner />}
      </h1>
      <hr className="mx-10" />

      <div className="mt-4 relative flex-row items-center justify-center text-lg mx-10 bg-slate-200 rounded-lg">
        {event ? (
          <Tab.Group>
            <Tab.List className="flex justify-center rounded-t-lg bg-slate-300 rounded-lg">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`rounded-tl-lg grow ${
                      selected ? "bg-slate-200 " : "bg-slate-300"
                    }`}
                  >
                    My Repairs
                  </button>
                )}
              </Tab>

              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`rounded-tr-lg grow ${
                      selected ? "bg-slate-200 " : "bg-slate-300"
                    }`}
                  >
                    Available
                  </button>
                )}
              </Tab>
            </Tab.List>

            <Tab.Panels className="flex-col text-center break-words justify-center pb-3">
              <Tab.Panel>
                <div className="">
                  <RequestView />
                  <RequestView />
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="">
                  <RequestView />
                  <RequestView />
                  <RequestView />
                  <RequestView />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default Home;
