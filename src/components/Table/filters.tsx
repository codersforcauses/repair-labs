import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HoverOpacityButton from "@/components/Button/hover-opacity-button";
import SearchBar from "@/components/Search/SearchBar";
import LoadingSpinner from "@/components/UI/loading-spinner";
import { useUsers } from "@/hooks/users";
import { isoToDatePickerValue } from "@/lib/datetime";
import { User } from "@/types";

// NOTE: State must be managed outside of components due to mounting/unmounting - can use React Redux for this?

export function OptionFilter({
  onClose,
  onFilterChange,
  options,
  selectedOptions
}: {
  onClose?: (event: MouseEvent) => void;
  onFilterChange?: (options: string[]) => void;
  options: string[];
  selectedOptions: string[];
}) {
  const toggleOption = (option: string) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((prevItem) => prevItem !== option)
      : [...selectedOptions, option];

    onFilterChange?.(newOptions);
  };

  const isAllClicked = options.every((element) =>
    selectedOptions.includes(element)
  );
  return (
    <FilterMenu onClose={(e) => onClose?.(e)}>
      {/* Select/Unselect All*/}
      <label className="select-none block">
        <input
          type="checkbox"
          onChange={() => onFilterChange?.(isAllClicked ? [] : [...options])}
          checked={isAllClicked}
        ></input>{" "}
        <strong>All</strong>
      </label>
      {/* Option list */}
      {options?.map((option) => (
        <label key={option} className="select-none block">
          <input
            type="checkbox"
            onChange={() => toggleOption(option)}
            checked={selectedOptions.includes(option)}
          ></input>{" "}
          {option}
        </label>
      ))}
    </FilterMenu>
  );
}

export function DateRangeFilter({
  onClose,
  onFilterChange,
  minDate,
  maxDate
}: {
  onClose?: (event: MouseEvent) => void;
  onFilterChange?: (minDate: string, maxDate: string) => void;
  minDate: string;
  maxDate: string;
}) {
  return (
    <FilterMenu onClose={(e) => onClose?.(e)}>
      <ConciseInput
        label="From"
        id="minDate"
        type="date"
        value={minDate}
        onChange={(value) => onFilterChange?.(value, maxDate)}
      />
      <ConciseInput
        label="To"
        id="maxDate"
        type="date"
        value={maxDate}
        onChange={(value) => onFilterChange?.(minDate, value)}
      />
    </FilterMenu>
  );
}

export function UserFilter({
  onClose,
  onFilterChange,
  selectedUsers
}: {
  onClose?: (event: MouseEvent) => void;
  onFilterChange?: (user: User[]) => void;
  selectedUsers: User[];
}) {
  const [userSearch, setUserSearch] = useState<string>("");
  const { data: users, isLoading } = useUsers(10, 1, "-created_at", userSearch);

  const addUser = (user: User) =>
    !selectedUsers.some((other) => other.id === user.id) &&
    onFilterChange?.([...selectedUsers, user]);
  const removeUserByIndex = (index: number) =>
    onFilterChange?.([
      ...selectedUsers.slice(0, index),
      ...selectedUsers.slice(index + 1)
    ]);
  const clearUsers = () => {
    onFilterChange?.([]);
  };

  // perhaps display the user list in the search box, similar to atlassian?

  return (
    <FilterMenu onClose={(e) => onClose?.(e)}>
      <div className="w-80">
        {/* Selected list*/}
        <div className="relative mb-4 overflow-x-scroll h-8 bg-gray-100 flex items-center text-xs">
          {selectedUsers.length == 0 ? (
            <div className="w-min ml-2 opacity-30 pointer-events-none">
              Empty
            </div>
          ) : (
            <HoverOpacityButton
              className="text-gray-500 text-[1.25rem] hover:enabled:scale-100 p-1"
              disabled={selectedUsers.length == 0}
              onClick={() => clearUsers()}
              title="Clear all"
            >
              <FontAwesomeIcon icon={faXmark} />
            </HoverOpacityButton>
          )}

          {selectedUsers.map((user: User, index) => (
            <div
              key={user.id}
              className="flex h-5/6 p-1 bg-gray-200 rounded-sm ml-1 mr-1"
            >
              <div className="h-full aspect-square rounded-full block mr-2 overflow-hidden flex-grow-0 flex-shrink-0">
                <Image
                  src="/images/repair_lab_logo.png"
                  width={30}
                  height={30}
                  alt="repair-labs"
                  className="h-full object-cover  "
                />
              </div>{" "}
              <div className="block overflow-hidden text-clip whitespace-nowrap">
                {user.firstName} {user.lastName}
              </div>
              <HoverOpacityButton
                className="text-gray-500 text-xs hover:enabled:scale-100 ml-2 hover:opacity-60"
                onClick={() => {
                  removeUserByIndex(index);
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </HoverOpacityButton>
            </div>
          ))}
        </div>

        {/* User search*/}
        <SearchBar
          className="mb-4"
          onSearchChange={(text) => setUserSearch(text)}
        />

        {/* Results list*/}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col">
            {users.items.map((user: User) => (
              <button
                key={user.id}
                className="flex h-8 p-1 hover:bg-slate-200 w-full rounded-sm"
                onClick={() => addUser(user)}
              >
                <div className="h-full aspect-square rounded-full block mr-2 overflow-hidden flex-grow-0 flex-shrink-0">
                  <Image
                    src="/images/repair_lab_logo.png"
                    width={30}
                    height={30}
                    alt="repair-labs"
                    className="h-full object-cover  "
                  />
                </div>
                <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.firstName} {user.lastName} {user.emailAddress}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </FilterMenu>
  );
}

function FilterMenu({
  onClose,
  children
}: {
  onClose: (event: MouseEvent) => void;
  children: ReactNode;
}) {
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as HTMLDivElement)
      )
        onClose(event);
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClose]);

  return (
    <div
      ref={filterRef}
      className="absolute inset-x-0 top-50 mt-2.5 bg-white p-4 shadow-md mx-auto rounded-2xl text-left max-h-72 overflow-y-scroll min-w-fit"
    >
      {children}
    </div>
  );
}

/** Displays label over the border */
function ConciseInput({
  label,
  id,
  type,
  value,
  onChange
}: {
  label: string;
  id: string;
  type: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const convertedValue =
    value && type === "date"
      ? isoToDatePickerValue(new Date(value)).substring(0, 10)
      : value;
  return (
    <div className="border-gray-500 border p-2 relative rounded-lg mb-4 last:mb-0">
      <label
        htmlFor={id}
        className="absolute -top-1/3 left-1 px-2 bg-white font-bold"
      >
        {label}
      </label>
      <input
        className="appearance-none border-none outline-none"
        id={id}
        type={type}
        value={convertedValue}
        onChange={(e) => {
          const value =
            type === "date"
              ? new Date(e.target.value).toISOString()
              : e.target.value;
          if (onChange) onChange(value);
        }}
      ></input>
    </div>
  );
}
