import { useRouter } from "next/router";
import { Disclosure, Transition } from "@headlessui/react";

// Contains type of info stored in our event box.
type BoxProps = {
  eventId: string;
  eventTitle: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  handleClick?: () => void;
};

const Box = ({
  eventId,
  eventTitle,
  startDate,
  endDate,
  description,
  location
}: BoxProps) => {
  const router = useRouter();

  return (
    <div className="mx-5 mt-4 rounded-lg bg-slate-200 shadow-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              as="div"
              className={`flex justify-between flex-row text-lg rounded-lg transition-colors duration-300 ease-in-out  ${
                !open ? "bg-slate-200" : "bg-slate-300"
              } `}
            >
              <div className="flex flex-col ml-2 mr-2">
                <span className="font-bold pt-2">{eventTitle}</span>
                <div className="pt-1 italic border-spacing-2">
                  {startDate} - {endDate}
                </div>
              </div>

              <div className="justify-right mr-2 -mt-2">
                <svg
                  fill="None"
                  viewBox="0 0 30 30"
                  strokeWidth={2}
                  stroke="black"
                  className="flex w-7 h-7 mt-8 justify-right"
                >
                  ;
                  <path
                    // Drop down/up icon from https://heroicons.com/
                    // Open source, MIT license.
                    d={
                      open
                        ? "M4.5 15.75l7.5-7.5 7.5 7.5"
                        : "M19.5 8.25l-7.5 7.5-7.5-7.5"
                    }
                  />
                </svg>
              </div>
            </Disclosure.Button>

            <Transition
              className="overflow-hidden"
              enter="transition-all ease-in-out duration-500"
              enterFrom="transform  max-h-0"
              enterTo="transform  max-h-[800px]"
              leave="transition-all ease-in-out duration-500"
              leaveFrom="transform  max-h-[800px]"
              leaveTo="transform  max-h-0"
            >
              <Disclosure.Panel className="pt-1 relative mb-2 mx-2">
                <p>Location: {location} </p>
                <p>Details: {description}</p>
                <div className="p-2 pt-4 relative flex justify-center">
                  <button
                    className="bg-primary-800 px-1000 w-48 opacity-50 rounded-lg text-white h-6 text-md hover:bg-primary-800 text-center"
                    onClick={() =>
                      // For future use when linking to issue 118
                      router.push("/my-events/" + eventId)
                    }
                  >
                    See Repair Requests {">"}
                  </button>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Box;
