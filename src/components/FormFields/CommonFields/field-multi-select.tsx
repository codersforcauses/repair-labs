import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  FieldValues,
  useController,
  UseControllerProps
} from "react-hook-form";
import { BsChevronExpand } from "react-icons/bs";
import { HiCheck } from "react-icons/hi";

import Label from "@/components/FormFields/box-label";
import Error from "@/components/FormFields/error-msg";
import FieldWrapper from "@/components/FormFields/field-wrapper";
import { Option } from "@/types";

export interface FormProps<T extends FieldValues = FieldValues>
  extends UseControllerProps<T> {
  options: Option[];
  size?: string;
  placeholder?: string;
  label?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
A component for a multiselect dropdown menu
  @param {{ id: number; text: string }[]} options array of objects with option text and id number
  @param {string} placeholder  placeholder string before any option is selected
  @param {string} label label for the field
  @param {string} size size of the field, specify width and height
 @returns {JSX.Element} A multiselect dropdown that is compatible w/ React-hook-forms 
*/
export default function FieldMultiSelect<T extends FieldValues = FieldValues>({
  options,
  placeholder,
  label,
  size = "h-10 w-full",
  ...props
}: FormProps<T>): JSX.Element {
  const { field, fieldState } = useController(props);
  const [selectedGroup, setSelectedGroup] = useState<Option[]>([]);

  const baseStyle = `flex w-full h-full justify-end overflow-hidden text-left rounded-lg bg-white px-3 py-2 text-base font-medium text-grey-900 shadow-sm ring-0 hover:shadow-grey-300 focus:ring-0 focus:outline-none focus:shadow-grey-300 transition-all duration-150 ease-in-out`;
  return (
    <FieldWrapper fieldState={fieldState} onChange={field.onChange}>
      <Label {...props} label={label ?? props.name} />
      <Listbox value={selectedGroup} onChange={setSelectedGroup} multiple>
        <Listbox.Button className={baseStyle}>
          <span className="w-full truncate">
            {selectedGroup.length === 0
              ? placeholder || "Select an option"
              : selectedGroup.map((option) => option.text).join(", ")}
          </span>
          <BsChevronExpand
            className=" h-5 w-5 text-grey-700"
            aria-hidden="true"
          />
        </Listbox.Button>
        {fieldState.invalid && <Error {...props} />}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute left-0 top-8 z-10 mt-2 max-h-60 w-full min-w-min origin-top overflow-auto rounded-md bg-white shadow-lg ring-0 ring-grey-500 focus:ring-0 focus:outline-none border border-grey-300">
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className="hover:bg-lightAqua-100 cursor-pointer relative"
                value={option}
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        selected
                          ? "font-semibold"
                          : active
                            ? "bg-lightAqua-100"
                            : "text-grey-900",
                        "truncate flex flex-row justify-between w-full py-2 px-3 text-grey-900"
                      )}
                    >
                      {option.text}
                      {selected && <HiCheck />}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </FieldWrapper>
  );
}