import { useState } from "react";
import Image from "next/image";

import AssigneeBadge from "@/components/Cards/assignee-badge";
import StatusPill from "@/components/Cards/status-pill";
import ImageCarousel from "@/components/Carousel/image-carousel";
import Modal from "@/components/Modal/index";
import { RepairRequestResponse } from "@/types";

export type CardProps = {
  handleClick?: () => void;
  repairRequestProps: RepairRequestResponse;
};

/**
 * A card component for displaying repair requests
 * Used in /manage/events/[id]/repair-requests.tsx
 * @component
 * @param {RepairRequestResponse} repairRequestProps - The repair request to display.
 * @returns {JSX.Element} The rendered card component.
 */
export default function RepairRequestCard({
  handleClick,
  repairRequestProps
}: {
  handleClick?: () => void;
  repairRequestProps: RepairRequestResponse;
}): JSX.Element {
  function defaultHandleClick() {
    setShowModal(true);
  }

  const [showModal, setShowModal] = useState(false);
  let assignee;
  if (repairRequestProps.assignedTo) {
    assignee =
      repairRequestProps.assignedTo.firstName &&
      repairRequestProps.assignedTo.lastName
        ? `${repairRequestProps.assignedTo.firstName} ${repairRequestProps.assignedTo?.lastName}`
        : repairRequestProps.assignedTo.emailAddress;
  } else {
    assignee = "Unassigned";
  }

  return (
    <div
      onClick={handleClick ? handleClick : defaultHandleClick}
      onKeyDown={handleClick ? handleClick : defaultHandleClick}
      role="presentation"
      className="group col-span-1 max-w-xs flex-col overflow-hidden rounded-lg bg-grey-100 shadow-md transition hover:-translate-y-0.5 hover:cursor-pointer hover:bg-grey-50"
    >
      <Modal
        title={
          <>
            <h3>Repair ID</h3>
            <h4 className="text-lg">{repairRequestProps.id}</h4>

            <StatusPill status={repairRequestProps.status} />
          </>
        }
        setShowPopup={setShowModal}
        showModal={showModal}
      >
        <div className="text-center">
          <div className="text-left mb-2">
            <h3 className="text-xl font-bold text-left">Details:</h3>
            <ImageCarousel images={repairRequestProps.images} />
            <div className="flex flex-row mt-2">
              <div className="border-r-2 pr-2 mr-2">
                <h4 className="font-bold">Brand</h4>
                <p className="mb-3">{repairRequestProps.itemBrand || "-"}</p>
                <h4 className="font-bold">Material</h4>
                <p className="mb-3">{repairRequestProps.itemMaterial || "-"}</p>
                <h4 className="font-bold">Hours Worked</h4>
                {repairRequestProps.hoursWorked || "-"}
              </div>
              <div className="w-8/12">
                <h4 className="font-bold">Description</h4>
                <p className="mb-3">{repairRequestProps.description || "-"}</p>
                <h4 className="font-bold">Repair Comment</h4>
                <p className="mb-3">
                  {repairRequestProps.repairComment || "-"}
                </p>
                <h4 className="font-bold">Parts Needed</h4>
                <p className="mb-3">{repairRequestProps.spareParts || "-"}</p>
              </div>
            </div>
            <div className="my-2">
              <h4 className="font-bold">Assigned to</h4>
              {assignee}
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex justify-center">
        <Image
          src={
            repairRequestProps.thumbnailImage || "/images/broken-clock-sad.jpg"
          }
          alt={"img for " + repairRequestProps.id}
          className="object-fit max-h-32 w-full"
          width={100}
          height={100}
        />
      </div>
      <div className="p-2">
        <div className="flex flex-row items-start justify-between">
          <h3 className="h-18 flex w-full flex-col  self-start text-xl font-bold">
            {repairRequestProps.itemType || "No item type"}
          </h3>

          <div className="pr-2">
            <StatusPill status={repairRequestProps.status} />
          </div>
        </div>
        <p className=" w-full text-sm font-semibold">
          {repairRequestProps.itemBrand || "No brand"}
        </p>
        <p className="text-sm font-mono font-semibold mb-3">
          {repairRequestProps.requestDate
            ? new Date(repairRequestProps.requestDate).toLocaleDateString()
            : "No date"}
        </p>
        <div>
          <p className="mb-3 h-32 overflow-y-hidden text-ellipsis text-sm font-light">
            {repairRequestProps.description}
          </p>
        </div>
        <div className="m-2 mt-0 flex justify-end">
          <AssigneeBadge
            firstName={repairRequestProps.assignedTo?.firstName || "Unassigned"}
            lastName={repairRequestProps.assignedTo?.lastName || ""}
            avatar={
              repairRequestProps.assignedTo?.imageUrl ||
              "/images/repair_lab_logo.jpg"
            }
            assignedTo={repairRequestProps.assignedTo?.id}
            repairRequestId={repairRequestProps.id}
          />
        </div>
        <div>
          <p className="mt-3 w-full text-xs font-italic text-pretty break-all">
            {repairRequestProps.id}
          </p>
        </div>
      </div>
    </div>
  );
}
