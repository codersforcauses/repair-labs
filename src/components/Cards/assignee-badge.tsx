import { SyntheticEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RepairStatus } from "@prisma/client";

import Button from "@/components/Button";
import Circle from "@/components/Cards/circle";
import VolunteerCard from "@/components/Cards/volunteer-card";
import Modal from "@/components/Modal";
import { useRepairers } from "@/hooks/events";
import { useUpdateRepairRequest } from "@/hooks/repair-request";

type Props = {
  firstName: string | undefined;
  lastName: string | undefined | null;
  avatar?: string | undefined;
  assignedTo?: string;
  repairRequestId?: string;
};

export default function AssigneeBadge({
  firstName,
  lastName,
  avatar,
  assignedTo,
  repairRequestId
}: Props) {
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const {
    query: { id: eventId }
  } = useRouter();
  const { data: repairers } = useRepairers(eventId as string);
  const { mutate: updateRepairRequest } =
    useUpdateRepairRequest(repairRequestId);

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    setShowAssigneeModal(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(event as SyntheticEvent);
    }
  };

  const handleUnassignVolunteer = () => {
    updateRepairRequest({
      assignedTo: "null",
      repairStatus: RepairStatus.PENDING
    });
    setShowAssigneeModal(false);
  };

  // Sort repairers to ensure the assigned repairer is displayed first
  const sortedRepairers = repairers?.sort((a, b) => {
    if (a.userId === assignedTo) return -1;
    if (b.userId === assignedTo) return 1;
    return 0;
  });

  return (
    <>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="rounded-lg bg-grey-200 p-2 hover:cursor-pointer"
      >
        <div>
          <div className="flex flex-row gap-2">
            <Image
              src={avatar ?? "/images/repair_lab_logo.jpg"}
              className="object-fit h-8 w-8 rounded-full"
              alt="avatar"
              width={100}
              height={100}
            />
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold">
                {firstName} {lastName ?? ""}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        showModal={showAssigneeModal}
        setShowPopup={setShowAssigneeModal}
        height="h-3/4"
      >
        <div className="h-full flex flex-col gap-4 text-center">
          <h1 className="text-xl font-bold">Assign Volunteer</h1>
          <div className="flex space-x-2 items-center justify-center">
            <Circle />
            <p className="font-medium">Task Assigned</p>
          </div>
          <div className="h-3/4">
            <div className="overflow-x-hidden overflow-y-auto mt-2 flex flex-row flex-wrap gap-5 justify-center ">
              {repairRequestId &&
                sortedRepairers &&
                sortedRepairers.map((repairer, index) => (
                  <VolunteerCard
                    repairRequestId={repairRequestId}
                    userId={repairer.userId}
                    firstName={repairer.firstName}
                    lastName={repairer.lastName}
                    avatar={repairer.avatar}
                    acceptedTasksCount={repairer.acceptedTasksCount}
                    email={repairer.email}
                    key={index}
                    assigned={repairer.userId === assignedTo}
                  />
                ))}
            </div>
          </div>

          <Button
            textSize="text-lg font-semibold"
            onClick={handleUnassignVolunteer}
          >
            Unassign this task
          </Button>
        </div>
      </Modal>
    </>
  );
}
