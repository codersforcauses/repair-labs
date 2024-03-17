import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

import Button from "@/components/Button";
import Search from "@/components/Search";
import TablePagination from "@/components/table/table-pagination";
import {
  useAddRepairerToEvent,
  useRemoveRepairerFromEvent
} from "@/hooks/repairers";
import { useUsers } from "@/hooks/users";
import { EventResponse, User } from "@/types";

/**
 * A component for managing volunteers for a repair event.
 * Takes care of adding and removing volunteers from an event.
 * @param setShowModal - A useState function to set the showModal state (if used in a modal).
 * @param volunteersArray - An array of volunteer ids that are already assigned to the event.
 * @param onSubmit - A custom function to call when the form is submitted.
 * @returns A div that contains a search bar, table, and submit button for modifying an event's volunteers
 */
export default function VolunteerManageForm({
  eventProps,
  volunteersArray,
  onSubmit,
  setShowModal
}: {
  eventProps: EventResponse;
  volunteersArray?: string[];
  onSubmit?: () => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  volunteersArray = volunteersArray ?? [];
  const [volunteers, setVolunteers] = useState(volunteersArray);
  const [staffToAdd, setStaffToAdd] = useState<string[]>([]);
  const [staffToRemove, setStaffToRemove] = useState<string[]>([]);
  // Constants for table - this is from the /users endpoint
  const [orderBy, _setOrderBy] = useState("-created_at");
  const [perPage, _setPerPage] = useState(7);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const { mutate: addRepairerToEvent } = useAddRepairerToEvent(eventProps.id);
  const { mutate: removeRepairerFromEvent } = useRemoveRepairerFromEvent(
    eventProps.id
  );

  const originalVolunteers = [...volunteersArray];
  const { data: users, isLoading } = useUsers(perPage, page, orderBy, query);
  const search = (value: string) => {
    // will need to setPage back to 1 otherwise it will be looking at the last page
    setPage(1);
    setQuery(value);
  };

  // Default submit handler
  const defaultOnSubmit = async () => {
    if (staffToAdd.length > 0) {
      addRepairerToEvent(staffToAdd);
    }
    if (staffToRemove.length > 0) {
      removeRepairerFromEvent(staffToRemove);
    }
    setShowModal(false);
  };

  return (
    <div className="m-1 flex flex-col justify-between gap-2 w-full h-full p-3">
      {/* Search Bar */}
      <Search onChange={search} />

      {/* Table - taken from /users */}
      <div className="relative p-2 shadow-md sm:rounded-lg h-full">
        <table className="max-h-4/5 overflow-y-auto text-left text-sm text-gray-500 text-ellipsis table-auto">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr className="px-6">
              <th scope="col" className="px-6 py-2">
                Name
              </th>
              <th scope="col" className="px-6 py-2">
                Email
              </th>
              <th scope="col" className="px-6 py-2">
                Role
              </th>
              <th scope="col" className="px-6 py-2 text-center">
                Add/Remove
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody className="w-full h-80 transition-all ease-in-out">
              <TableLoadingAnimation />
              <TableLoadingAnimation />
              <TableLoadingAnimation />
              <TableLoadingAnimation />
            </tbody>
          ) : (
            <tbody className="transition-all ease-in-out">
              {users?.items.map((user: User, index: number) => {
                return (
                  <VolunteerRow
                    key={user.id}
                    user={user}
                    index={index}
                    volunteersArray={volunteers}
                    setVolunteersArray={setVolunteers}
                    originalVolunteers={originalVolunteers}
                    staffToAdd={staffToAdd}
                    staffToRemove={staffToRemove}
                    setStaffToAdd={setStaffToAdd}
                    setStaffToRemove={setStaffToRemove}
                  />
                );
              })}
            </tbody>
          )}
        </table>
        <div className="w-full">
          <TablePagination
            perPage={perPage}
            page={page}
            totalCount={Number(users?.meta.totalCount)}
            prevPage={() =>
              setPage(Number(page) - 1 == 0 ? 1 : Number(page) - 1)
            }
            nextPage={() =>
              setPage(
                Number(page) + 1 > Number(users?.meta.lastPage)
                  ? Number(users?.meta.lastPage)
                  : Number(page) + 1
              )
            }
          />
        </div>
      </div>
      {/* Submit */}
      <div className="my-3 flex flex-col">
        <p>Total Volunteers: {volunteers.length}</p>
        <p className="text-sm mb-6">
          Removing {staffToRemove.length} volunteers and Adding{" "}
          {staffToAdd.length} volunteers
        </p>
        <Button
          onClick={onSubmit ? onSubmit : defaultOnSubmit}
          height="h-9"
          width="w-full"
          textSize="text-lg"
          hover="hover:bg-primary-400 active:scale-105 transition"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

/**
 * A component for a pill that represents a user's role.
 * @param role - A user's role
 * @returns A pill that represents a user's role.
 */
const RolePill = ({ role }: { role: string }) => {
  let bgColor;
  switch (role) {
    case "ADMIN":
      bgColor = "bg-red-300";
      break;
    case "CLIENT":
      bgColor = "bg-secondary-300";
      break;
    case "REPAIRER":
      bgColor = "bg-yellow-300";
  }
  return (
    <div
      className={`${bgColor} rounded-full p-1 text-sm font-bold text-white text-center`}
    >
      {role}
    </div>
  );
};

/**
 * A component for each row in the table for volunteerManageForm.
 * @param user - A user object
 * @param index - The index of the user in the table
 * @param volunteersArray - An array of volunteer ids that are already assigned to the event.
 * @param setVolunteersArray - A useState function to set the volunteersArray state.
 * @param originalVolunteers - A constant array of volunteer ids that are already assigned to the event.
 * @param staffToAdd - An array of volunteer ids that are to be added to the event.
 * @param staffToRemove - An array of volunteer ids that are to be removed from the event.
 * @param setStaffToAdd - A useState function to set the staffToAdd state.
 * @param setStaffToRemove - A useState function to set the staffToRemove state.
 * @returns A row in the table for volunteerManageForm.
 */
const VolunteerRow = ({
  user,
  index,
  volunteersArray,
  setVolunteersArray,
  originalVolunteers,
  staffToAdd,
  staffToRemove,
  setStaffToAdd,
  setStaffToRemove
}: {
  user: User;
  index: number;
  volunteersArray: string[];
  setVolunteersArray: React.Dispatch<React.SetStateAction<string[]>>;
  originalVolunteers: string[];
  staffToAdd: string[];
  staffToRemove: string[];
  setStaffToAdd: React.Dispatch<React.SetStateAction<string[]>>;
  setStaffToRemove: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const animatedButtonStyle =
    "hover:scale-110 active:scale-125 transition duration-1 ease-in-out";

  const minusClick = () => {
    setVolunteersArray(volunteersArray.filter((id) => id !== user.id));
    if (originalVolunteers.includes(user.id)) {
      setStaffToRemove([...staffToRemove, user.id]);
    }
    setStaffToAdd(staffToAdd.filter((id) => id !== user.id));
  };
  const addClick = () => {
    setVolunteersArray([...volunteersArray, user.id]);
    setStaffToAdd([...staffToAdd, user.id]);
    setStaffToRemove(staffToRemove.filter((id) => id !== user.id));
  };
  return (
    /** have a check to see if volunter id is in final array of volunteers, if it is dont list this volunteer */
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-secondary-50"
      } h-8 border-b hover:bg-gray-100`}
    >
      <th scope="row" className="px-6 py-2 font-medium text-gray-900">
        {user.firstName} {user.lastName}
      </th>
      <td className="px-6 py-2 text-gray-900">{user.emailAddress}</td>
      <td className="px-6 py-2 text-gray-900">
        <RolePill role={user.role} />
      </td>
      <td className="px-6 py-2 flex justify-center text-center align-middle">
        {/** check if this volunteer is in the array of volunteers to add, if so display minus, else plus.
         * If button is clicked on, add/delete from volunteersArray
         */}
        {volunteersArray?.includes(user.id) ? (
          <Button
            height="h-8 flex justify-center align-middle items-center"
            width={"w-8 " + animatedButtonStyle}
            color="bg-red-500"
            hover="hover:bg-red-600"
            onClick={minusClick}
          >
            <FaMinus />
          </Button>
        ) : (
          <Button
            height="h-8 flex justify-center align-middle items-center"
            width={"w-8 " + animatedButtonStyle}
            hover="hover:bg-primary-500"
            onClick={addClick}
          >
            <FaPlus />
          </Button>
        )}
      </td>
    </tr>
  );
};

/**
 * A component for a loading animation for the table in VolunteerManageForm.
 * @returns A loading animation for the table in VolunteerManageForm.
 */
const TableLoadingAnimation = () => {
  return (
    <tr className="animate-pulse h-12">
      <td className="w-28">
        <div className="rounded bg-slate-400 h-2 w-5 m-auto my-2"></div>
      </td>
      <td className="w-52">
        <div className="grid grid-cols-3 gap-1 my-2">
          <div className="h-2 bg-slate-400 rounded col-span-1"></div>
          <div className="h-2 bg-slate-400 rounded col-span-2"></div>
        </div>
      </td>
      <td className="w-28">
        <div className="h-2 w-12 bg-slate-400 rounded place-self-center m-auto"></div>
      </td>
      <td className="w-28">
        <div className="h-3 w-6 bg-slate-400 rounded place-self-center m-auto"></div>
      </td>
    </tr>
  );
};
