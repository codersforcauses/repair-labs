import { Fragment, useCallback, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiChevronDown } from "react-icons/hi";

import Search from "@/components/Search";
import cn from "@/lib/classnames";
import isBlank from "@/lib/is-blank";

type SelectValueType<
  Value,
  Option,
  Mutiple extends boolean,
  UseOption extends boolean
> = Mutiple extends true
  ? UseOption extends true
    ? Option[]
    : Value[]
  : UseOption extends true
    ? Option
    : Value;

export interface SelectProps<
  Option extends Record<NameKey | ValueKey, unknown>,
  Multiple extends boolean = false,
  UseOption extends boolean = false,
  NameKey extends string = "name",
  ValueKey extends string = "value",
  SelectValue = SelectValueType<Option[ValueKey], Option, Multiple, UseOption>
> {
  label?: string;
  multiple?: Multiple;
  /** if true, the value will be option instead of value of option */
  useOption?: UseOption;
  options?: Option[];
  value?: SelectValue;
  onChange?: (value: SelectValue) => void;
  placeholder?: string;
  renderSelected?: (
    values: SelectValue,
    options: Option[],
    onChange?: (value: SelectValue) => void
  ) => JSX.Element;
  // renderOption?: (option: Option) => JSX.Element; // Not Implement yet
  searchValue?: string;
  onSearch?: (search: string) => void;
  nameKey?: NameKey;
  valueKey?: ValueKey;
  renderList?: (options: Option[]) => JSX.Element;
  className?: string;
  afterLabel?: JSX.Element;
  underInput?: JSX.Element;
}

/**
 * Select component (Nonstable)
 * test page: http://localhost:3000/tests/select_component
 * ref: https://headlessui.com/react/listbox
 * todo: merge with FieldSelct
 * todo: optimise animation
 */
export default function Select<
  Option extends Record<NameKey | ValueKey, unknown>,
  Multiple extends boolean = false,
  UseOption extends boolean = false,
  NameKey extends string = "name",
  ValueKey extends string = "value",
  SelectValue = SelectValueType<Option[ValueKey], Option, Multiple, UseOption>
>(
  props: SelectProps<
    Option,
    Multiple,
    UseOption,
    NameKey,
    ValueKey,
    SelectValue
  >
) {
  const {
    label,
    multiple = false,
    useOption = false,
    options = [],
    value = [] as SelectValue,
    onChange,
    placeholder = "Please select",
    renderSelected,
    searchValue,
    onSearch,
    nameKey = "name" as NameKey,
    valueKey = "value" as ValueKey,
    renderList,
    className,
    afterLabel,
    underInput
  } = props;

  const selectedOptions = useMemo(() => {
    const optionsOrValues = [...(Array.isArray(value) ? value : [value])];
    return (
      optionsOrValues
        .map((OptionOrValue) =>
          useOption
            ? options.find(
                (option) => option[valueKey] === OptionOrValue[valueKey]
              ) // Value is option
            : options.find((option) => option[valueKey] === OptionOrValue)
        )
        // Because options may still loading or value is not in options
        .filter((v) => v) as Option[]
    );
  }, [value, options, useOption, valueKey]);

  const handleChange = useCallback(
    (nextOptions: Option | Option[]) => {
      if (useOption) {
        onChange?.(nextOptions as SelectValue);
      } else if (multiple) {
        const values = (nextOptions as Option[]).map(
          (option) => option[valueKey]
        );
        onChange?.(values as SelectValue);
      } else {
        onChange?.((nextOptions as Option)[valueKey] as SelectValue);
      }
    },
    [useOption, multiple, onChange, valueKey]
  );

  return (
    <Listbox
      value={selectedOptions}
      onChange={handleChange}
      multiple={multiple}
    >
      <Listbox.Button
        as="div"
        className={cn(
          "relative flex items-center h-10 w-full justify-between rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-primary-500 hover:shadow-grey-300",
          className
        )}
      >
        <label className="absolute -top-2 left-2 flex flex-row items-center gap-0.5 rounded-full bg-white px-1 text-xs font-semibold text-black select-none">
          {label}
          {afterLabel}
        </label>
        {isBlank(value) ? (
          <span className="text-gray-500 text-nowrap select-none">
            {placeholder}
          </span>
        ) : renderSelected ? (
          renderSelected(value, selectedOptions, onChange)
        ) : (
          <span className="truncate text-grey-900 select-none">
            {selectedOptions?.map((option) => option[nameKey]).join(", ")}
          </span>
        )}
        <HiChevronDown
          className="ml-auto h-6 w-5 text-grey-600"
          aria-hidden="true"
        />
        <div className="absolute">{underInput}</div>
        <Transition
          className="z-10 absolute w-full left-0 top-10"
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          onClick={(e) => e.stopPropagation()}
        >
          <Listbox.Options className="absolute w-full outline-none">
            <div className="relative py-1 left-0 z-10 max-h-60 w-full min-w-min origin-top overflow-auto rounded-md bg-white shadow-lg ring-1 ring-grey-800 ring-opacity-10 focus:outline-none">
              {onSearch && (
                <Search
                  className="sticky top-0"
                  value={searchValue}
                  onChange={onSearch}
                />
              )}
              {renderList
                ? renderList(options)
                : options.map((option) => (
                    <Listbox.Option
                      key={`${option[valueKey]}`}
                      value={option}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          className={cn(
                            active
                              ? "bg-lightAqua-100 text-grey-900"
                              : "text-grey-900",
                            "block py-2 pl-2 pr-4 text-sm"
                          )}
                        >
                          <span className="relative left-0 flex">
                            <HiCheck
                              className={cn("h-5 w-5 text-darkAqua-600", {
                                invisible: !selected
                              })}
                              aria-hidden="true"
                            />
                            <span
                              className={cn("pl-2", {
                                "font-medium": selected
                              })}
                            >
                              {`${option[nameKey] ?? option[valueKey]}`}
                            </span>
                          </span>
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
            </div>
          </Listbox.Options>
        </Transition>
      </Listbox.Button>
    </Listbox>
  );
}
