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

export default function Card({ props }: { props: CardProps }) {
  function handleClick() {
    setShowModal(true);
  }

  const [showModal, setShowModal] = useState(false);

  return (
    <div
      onClick={props.handleClick ? props.handleClick : handleClick}
      onKeyDown={props.handleClick ? props.handleClick : handleClick}
      role="presentation"
      className="group col-span-1 max-w-xs flex-col overflow-hidden rounded-lg bg-grey-100 shadow-md transition hover:-translate-y-0.5 hover:cursor-pointer hover:bg-grey-50"
    >
      <Modal
        title={
          <>
            <h3>Repair ID</h3>
            <h4 className="text-lg">{props.repairRequestProps.id}</h4>

            <StatusPill status={props.repairRequestProps.status} />
          </>
        }
        setShowPopup={setShowModal}
        showModal={showModal}
      >
        <div className="text-center">
          <div className="text-left mb-2">
            <h3 className="text-xl font-bold text-left">Details:</h3>
            <ImageCarousel images={props.repairRequestProps.images} />
            <div className="flex flex-row mt-2">
              <div className="border-r-2 pr-2 mr-2">
                <h4 className="font-bold">Brand</h4>
                <p className="mb-3">
                  {props.repairRequestProps.itemBrand || "-"}
                </p>
                <h4 className="font-bold">Material</h4>
                <p className="mb-3">
                  {props.repairRequestProps.itemMaterial || "-"}
                </p>
                <h4 className="font-bold">Hours Worked</h4>
                {props.repairRequestProps.hoursWorked || "-"}
              </div>
              <div className="w-8/12">
                <h4 className="font-bold">Description</h4>
                <p className="mb-3">
                  {props.repairRequestProps.description || "-"}
                </p>
                <h4 className="font-bold">Repair Comment</h4>
                <p className="mb-3">
                  {props.repairRequestProps.repairComment || "-"}
                </p>
                <h4 className="font-bold">Parts Needed</h4>
                <p className="mb-3">
                  {props.repairRequestProps.spareParts || "-"}
                </p>
              </div>
            </div>
            <div className="my-2">
              <h4 className="font-bold">Assigned to</h4>
              {props.repairRequestProps.assignedTo?.lastName
                ? `${props.repairRequestProps.assignedTo?.firstName} ${props.repairRequestProps.assignedTo?.lastName}`
                : "-"}
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex justify-center">
        <Image
          src={
            props.repairRequestProps.thumbnailImage ||
            "/images/broken-clock-sad.jpg"
          }
          alt={"img for " + props.repairRequestProps.id}
          className="object-fit max-h-32 w-full"
          width={100}
          height={100}
        />
      </div>
      <div className="p-2">
        <div className="flex flex-row items-start justify-between">
          <h3 className="h-18 flex w-full flex-col  self-start text-xl font-bold">
            {props.repairRequestProps.itemType || "No item type"}
          </h3>

          <div className="pr-2">
            <StatusPill status={props.repairRequestProps.status} />
          </div>
        </div>
        <p className=" w-full text-sm font-semibold">
          {props.repairRequestProps.itemBrand || "No brand"}
        </p>
        <p className="text-sm font-mono font-semibold mb-3">
          {props.repairRequestProps.requestDate
            ? new Date(
                props.repairRequestProps.requestDate
              ).toLocaleDateString()
            : "No date"}
        </p>
        <div>
          <p className="mb-3 h-32 overflow-y-hidden text-ellipsis text-sm font-light">
            {props.repairRequestProps.description}
          </p>
        </div>
        <div className="m-2 mt-0 flex justify-end">
          <AssigneeBadge
            firstName={
              props.repairRequestProps.assignedTo?.firstName || "Unassigned"
            }
            lastName={props.repairRequestProps.assignedTo?.lastName || ""}
            avatar="/images/repair_lab_logo.jpg"
          />
        </div>
        <div>
          <p className="mb-3 w-full text-xs font-italic text-pretty break-all">
            {props.repairRequestProps.id}
          </p>
        </div>
      </div>
    </div>
  );
}
