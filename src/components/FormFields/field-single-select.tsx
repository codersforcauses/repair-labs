import { Fragment } from "react";
import { useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  FieldValues,
  useController,
  UseControllerProps
} from "react-hook-form";
import { HiCheck, HiChevronDown } from "react-icons/hi";

import Label from "@/components/FormFields/box-label";
import Error from "@/components/FormFields/error-msg";
import { Option } from "@/types";

export interface FormProps<T extends FieldValues = FieldValues>
  extends UseControllerProps<T> {
  options: Option[];
  width?: string;
  height?: string;
  placeholder?: string;
  label?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/*
This is a component for a dropdown menu
Will display a dropdown displaying options inputted
Input:
  options: { id: number; text: string }[]; // array of objects with option text and id number
  placeholder: string; // placeholder string before any option is selected
  label?: string; // text on border of button
Output:
  A dropdown that is compatible w/ React-hook-forms 
*/

export default function FieldSingleSelect<T extends FieldValues = FieldValues>({
  options,
  placeholder,
  label,
  width = "w-full",
  height = "h-10",
  ...props
}: FormProps<T>) {
  const { field, fieldState } = useController(props);
  const [displayText, setDisplayText] = useState(field.value?.toString());

  const baseStyle = `flex ${height} ${width} justify-between overflow-hidden rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset hover:shadow-grey-300`;
  const normalBorderStyle = `ring-grey-300`;
  const errorBorderStyle = `ring-red-500`;
  return (
    <div className={`relative mb-2 inline-block ${width} text-left`}>
      <Menu>
        <div>
          <Menu.Button
            className={classNames(
              `${baseStyle}`,
              fieldState.invalid
                ? `${errorBorderStyle}`
                : `${normalBorderStyle}`
            )}
          >
            <Label label={!label ? props.name : label} {...props} />
            {fieldState.invalid && <Error {...props} />}
            {field.value === "" ? (
              <span className="text-gray-500">
                {!placeholder ? `Select ${props.name}` : `${placeholder}`}
              </span>
            ) : (
              <span className="truncate text-grey-900">{displayText}</span>
            )}
            <HiChevronDown
              className="ml-auto h-6 w-5 text-grey-600"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 max-h-60 w-full min-w-min origin-top overflow-auto rounded-md bg-white shadow-lg ring-1 ring-grey-800 ring-opacity-10 focus:outline-none">
            <div className="py-1">
              {options.map((option) => (
                <Menu.Item key={option.id}>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => {
                        field.onChange(option.id);
                        setDisplayText(option.text);
                      }}
                      className={classNames(
                        active
                          ? "bg-lightAqua-100 text-grey-900"
                          : "text-grey-900",
                        "block py-2 pl-2 pr-4 text-sm"
                      )}
                    >
                      {option.id === field.value ? (
                        <span className="relative left-0 flex">
                          <HiCheck
                            className="h-5 w-5 text-darkAqua-600"
                            aria-hidden="true"
                          />
                          <span className="pl-2 font-medium">
                            {option.text}
                          </span>
                        </span>
                      ) : (
                        <span className="pl-7">{option.text}</span>
                      )}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
