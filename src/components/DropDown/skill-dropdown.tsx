import React, { useState, Fragment, useRef, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import SelectedOption from "@/components/Tag/tag";
import { GoChevronUp, GoChevronDown } from "react-icons/go";

// Define skills
const options = [
  "toys",
  "bikes",
  "furniture",
  "clothing",
  "jewellery",
  "curtains",
  "household items",
  "garden tools"
];

const Dropdown: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
    setFilter("");
  };

  const removeItem = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={wrapperRef}>
      <Menu as="div" className="relative inline-block text-left w-full">
        <div className="flex border-2 border-slate-300 rounded-md">
          <div className="flex flex-wrap items-center flex-grow">
            {selectedItems.map((item) => (
              <SelectedOption key={item} option={item} onRemove={removeItem} />
            ))}
            {(!selectedItems.length || isOpen) && (
              <input
                type="text"
                className="flex-1 pl-1 m-1 text-sm w-full focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder="Add Skills"
              />
            )}
          </div>
          <Menu.Button
            className="px-4 py-2 bg-slate-50 text-primary-600 rounded-r-md"
            onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
          >
            {isOpen ? <GoChevronUp /> : <GoChevronDown />}
          </Menu.Button>
        </div>
        {isOpen && (
          <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute w-full mt-2 origin-top-right bg-white divide-y border-slate-300 rounded-md shadow-lg ring-1 ring-grey-950 ring-opacity-5 focus:outline-none z-50 max-h-60 overflow-auto"
            >
              <div className="px-1 py-1">
                {filteredOptions.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <button
                        onClick={() => toggleItem(option)}
                        className={`${
                          active
                            ? "bg-lightAqua-500 text-white"
                            : "text-gray-900"
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        {option}
                      </button>
                    )}
                  </Menu.Item>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No skills found
                  </div>
                )}
              </div>
            </Menu.Items>
          </Transition>
        )}
      </Menu>
    </div>
  );
};

export default Dropdown;
