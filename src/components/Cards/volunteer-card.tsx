import { useState } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { RepairStatus } from "@prisma/client";

import Button from "@/components/Button";
import Circle from "@/components/Cards/circle";
import Modal from "@/components/Modal";
import { useUpdateRepairRequest } from "@/hooks/repair-request";

type Props = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  acceptedTasksCount: number;
  repairRequestId: string | undefined;
  assigned: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export default function VolunteerCard({
  userId,
  firstName,
  lastName,
  avatar,
  acceptedTasksCount,
  repairRequestId,
  assigned
}: Props) {
  const { mutate: updateRepairRequest } = useUpdateRepairRequest(
    repairRequestId as string
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleAssignVolunteer = () => {
    updateRepairRequest({
      assignedTo: userId,
      repairStatus: RepairStatus.ACCEPTED
    });
    setShowConfirmation(false);
  };

  return (
    <div
      className={`${
        inter.className
      } relative w-64 rounded-lg p-2 hover:cursor-pointer
      ${assigned ? "bg-app-secondary-focus" : "bg-app-secondary"}`}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex flex-row gap-2">
        {/* LEFT: Avatar of volunteer */}
        <div className="flex justify-center items-center">
          <Image
            src={avatar || "/images/repair_lab_logo.jpg"}
            className="rounded-md h-[72px] w-[72px] m-auto"
            alt="avatar"
            width={80}
            height={80}
          />
        </div>

        {/* MIDDLE */}
        <div className="flex flex-col gap-y-1">
          {/* Name of volunteer*/}
          <p className="text-base font-semibold text-left">
            {firstName} {lastName ?? ""}
          </p>
          {/* Skills */}
          <p className="w-fit text-app-base-300 bg-app-accent rounded-lg px-1 text-sm">
            Woodworking
          </p>
          <p className="w-fit text-app-base-300 bg-[#e6cffb] rounded-lg px-1 text-sm">
            Bike Repair
          </p>
        </div>

        {/* RIGHT: #. of assigned tasks */}
        <div className="absolute right-2">
          <Circle numberOfTasks={acceptedTasksCount} />
        </div>
      </div>

      <Modal
        showModal={showConfirmation}
        setShowPopup={setShowConfirmation}
        height="h-1/5"
        width="w-96"
      >
        <div className="h-full flex flex-col gap-4 text-center ">
          <h1 className="text-xl font-bold">Assign Volunteer</h1>

          <div className="overflow-hidden mt-1 flex flex-col gap-6">
            <p className="text-s font-semibold">
              Are you sure you want to assign this task to {firstName}
              {lastName ? " " : ""}
              {lastName ?? ""}?
            </p>

            <div className="space-x-8">
              <Button
                height="h-9"
                width="w-20 font-semibold"
                color="bg-gray-200"
                hover="hover:bg-gray-300"
                textColor="black"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                height="h-9"
                width="w-20 font-semibold"
                color="bg-app-secondary-focus"
                textColor="black"
                onClick={handleAssignVolunteer}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
