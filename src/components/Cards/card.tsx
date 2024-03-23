import { useState } from "react";
import Image from "next/image";
import { SubmitHandler } from "react-hook-form";

import AssigneeBadge from "@/components/Cards/assignee-badge";
import StatusPill from "@/components/Cards/status-pill";
import PrepopulatedRepairAttemptForm from "@/components/Forms/prepopulated-repair-request-form";
import Modal from "@/components/Modal/index";
import { useUpdateRepairRequest } from "@/hooks/repair-request";
import { GeneralRepairAttempt, RepairRequestResponse } from "@/types";

export type CardProps = {
  title?: string;
  description?: string;
  image?: string;
  status?: string;
  firstName?: string;
  lastName?: string | null;
  avatar?: string;
  assignedTo?: string;
  handleClick?: () => void;
  repairRequestProps: RepairRequestResponse;
};

export default function Card({ props }: { props: CardProps }) {
  function handleClick() {
    setShowModal(true);
  }

  const { mutate: updateRepairRequest } = useUpdateRepairRequest(props.title);

  const [showModal, setShowModal] = useState(false);

  const onSubmit: SubmitHandler<GeneralRepairAttempt> = async (data) => {
    updateRepairRequest(data, {
      onSuccess: () => {
        setShowModal(false);
      }
    });
  };

  return (
    <div
      role="presentation"
      className="group col-span-1 max-w-xs flex-col overflow-hidden rounded-lg bg-grey-100 shadow-md transition hover:-translate-y-0.5 hover:bg-grey-50"
    >
      <Modal
        title={
          <>
            <h3>
              Repair ID
              {props.title}
            </h3>

            <StatusPill status={props.status} />
          </>
        }
        setShowPopup={setShowModal}
        showModal={showModal}
      >
        <div className="text-center">
          <div>
            <PrepopulatedRepairAttemptForm
              props={props.repairRequestProps}
              onSubmit={onSubmit}
            ></PrepopulatedRepairAttemptForm>
          </div>
        </div>
      </Modal>
      <div className="flex justify-center">
        <Image
          src={props.image || ""}
          alt="hello"
          className="object-fit max-h-32 w-full"
          width={100}
          height={100}
        />
      </div>
      <div className="p-2">
        <div
          onClick={props.handleClick ? props.handleClick : handleClick}
          onKeyDown={props.handleClick ? props.handleClick : handleClick}
          className="hover:cursor-pointer hover:underline"
          role="button"
          tabIndex={0}
        >
          <div className="flex flex-row items-start justify-between">
            <h3 className="h-18 flex w-full flex-col  self-start text-xl font-bold">
              Repair ID:
            </h3>

            <div className="pr-2">
              <StatusPill status={props.status} />
            </div>
          </div>
          <p className="mb-3 w-full text-sm font-semibold">{props.title}</p>
        </div>
        <div>
          <p className="mb-3 h-32 overflow-y-scroll text-ellipsis text-sm font-light">
            {props.description}
          </p>
        </div>
        <div className="m-2 mt-0 flex justify-end">
          <AssigneeBadge
            firstName={props.firstName}
            lastName={props.lastName}
            avatar={props.avatar}
            assignedTo={props.assignedTo}
            repairRequestId={props.title}
          />
        </div>
      </div>
    </div>
  );
}
