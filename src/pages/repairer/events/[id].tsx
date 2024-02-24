// Page for repairers to view the repair requests associated with
// a given event. This page is accessed via the my-events page.
// Review / replace page once issue 118 is merged.
import { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";

import RequestView from "@/components/EventBox/request-view";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useEvent, useRepairRequests } from "@/hooks/events";
import { RepairRequestResponse } from "@/types";
import { formatDate } from "@/utils";

const Home = () => {
  const {
    query: { id }
  } = useRouter();

  const eventId = id?.toString();

  const { data: event } = useEvent(eventId);

  const { data: repairRequests, isLoading: isRepairRequestsLoading } =
    useRepairRequests({ eventId });

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

            <Tab.Panels className="relative flex-row items-center justify-center mb-10">
              <Tab.Panel>
                {/* CONTENT */}
                {isRepairRequestsLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : repairRequests && repairRequests.items.length > 0 ? (
                  <div>
                    <ul id="repairRequestList">
                      {repairRequests.items.map(
                        (item: RepairRequestResponse) => (
                          <div key={item.id}>
                            <RequestView
                              repairRequestId={item.id}
                              requestDate={formatDate(String(item.requestDate))}
                              createdBy={item.createdBy}
                              itemType={item.itemType}
                              itemBrand={item.itemBrand}
                              description={item.description}
                              repairAttemptProps={item}
                            />
                          </div>
                        )
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="relative flex w-full justify-center text-2xl mt-12 text-center text-slate-600 italic font-semibold  text-opacity-90">
                    No repair requests found for this event.
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                <div className="relative flex w-full justify-center text-2xl mt-12 text-center text-slate-600 italic font-semibold  text-opacity-90">
                  No available repair requests found for this event.
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
