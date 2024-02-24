import { useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";

import RepairAttemptForm from "@/components/Forms/repair-attempt-form";
import Modal from "@/components/Modal";
import { RepairRequestResponse, User } from "@/types";

// Contains type of info stored in our event box.
export type RequestProps = {
  repairRequestId: string;
  createdBy: User;
  requestDate: string;
  itemType: string;
  itemBrand: string;
  description: string;
  repairAttemptProps: RepairRequestResponse;
};

const RequestView = ({
  repairRequestId,
  createdBy,
  requestDate,
  itemType,
  itemBrand,
  description,
  repairAttemptProps
}: RequestProps) => {
  const [showRepairRequestModal, setShowRepairRequestModal] = useState(false);
  function manageModal() {
    setShowRepairRequestModal(true);
  }
  return (
    <div className="mx-5 mt-4 rounded-lg bg-slate-200 shadow-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`flex justify-between text-lg items-center w-full pl-2 pr-3 rounded-lg transition-colors duration-300 ease-in-out  ${
                !open ? "bg-slate-200" : "bg-slate-300"
              } `}
            >
              <div className=" flex flex-col text-left py-2">
                <span className="font-bold">
                  {repairRequestId}- {createdBy.firstName} {createdBy.lastName}
                </span>
              </div>
              <FaChevronDown
                className={`transition duration-300 ease-in-out ${
                  open ? "-rotate-180" : ""
                }`}
              />
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
                <p className="space-x-1">
                  <span className="font-semibold">Request Date:</span>
                  <span>{requestDate}</span>
                </p>
                <p className="space-x-1">
                  <span className="font-semibold">Item Type:</span>
                  <span>{itemType}</span>
                </p>
                <p className="space-x-1">
                  <span className="font-semibold">Item Brand:</span>
                  <span>{itemBrand}</span>
                </p>
                <p className="space-x-1">
                  <span className="font-semibold">Details:</span>
                  <span>{description}</span>
                </p>

                {/* Button Container */}
                <div className="flex justify-center mt-1">
                  <button
                    className="bg-primary-700 px-4 py-1 rounded-lg text-white text-md hover:bg-primary-600"
                    onClick={manageModal}
                    onKeyDown={manageModal}
                  >
                    Repair
                  </button>
                </div>
                <Modal
                  showModal={showRepairRequestModal}
                  setShowPopup={setShowRepairRequestModal}
                  height="h-full overflow-auto"
                  title="Repair Attempt"
                  width="w-[85svw] sm:w-[80svw] sm:max-w-3/4 md:w-3/4 lg:w-2/3"
                  crossWidthAndHeight="w-10 h-10"
                >
                  <div className="text-center">
                    <div>
                      <RepairAttemptForm props={repairAttemptProps} />
                    </div>
                  </div>
                </Modal>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default RequestView;
