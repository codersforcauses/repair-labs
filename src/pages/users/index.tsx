import { ChangeEvent, useState } from "react";

import TablePagination from "@/components/Table/table-pagination";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useUsers } from "@/hooks/users";
import { useUpdateUserRole } from "@/hooks/users";
import { UserRole } from "@/types";
import { User } from "@/types";

const User = () => {
  const [orderBy, _setOrderBy] = useState("-created_at");
  const [perPage, _setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data: users, isLoading } = useUsers(perPage, page, orderBy, query);

  const search = (e: ChangeEvent<HTMLInputElement>) => {
    // will need to setPage back to 1 otherwise it will be looking at the last page
    setPage(1);
    setQuery(e.target.value);
  };

  return (
    <div className="p-20">
      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-4 w-4 text-gray-500 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="default-search"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search User ID, First name, Last name, Email"
          required
          value={query}
          onChange={(e) => search(e)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="relative overflow-x-auto p-10 shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    First Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.items.map((user: User, index: number) => {
                  return <UserRow key={user.id} user={user} index={index} />;
                })}
              </tbody>
            </table>

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
        </>
      )}
    </div>
  );
};

export default User;

const UserRow = ({ user, index }: { user: User; index: number }) => {
  const { mutate: updateUser } = useUpdateUserRole(user.id);

  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-secondary-50"
      } h-8 border-b hover:bg-gray-100`}
    >
      <th
        scope="row"
        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900"
      >
        {user.firstName}
      </th>
      <td className="px-6 py-4">{user.lastName}</td>
      <td className="px-6 py-4">{user.emailAddress}</td>
      <td className="px-6 py-4">
        <select
          value={user.role}
          className="capitalize"
          onChange={(e) => {
            updateUser(e.target.value as UserRole);
          }}
        >
          {Object.keys(UserRole).map((role) => {
            return (
              <option value={role} key={role}>
                {role.trim().toLowerCase().replace("_", " ")}
              </option>
            );
          })}
        </select>
      </td>
    </tr>
  );
};
