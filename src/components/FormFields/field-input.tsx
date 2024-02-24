import { ReactElement } from "react";
import Image from "next/image";
import {
  FieldValues,
  useController,
  UseControllerProps
} from "react-hook-form";

import Label from "@/components/FormFields/box-label";
import Error from "@/components/FormFields/error-msg";
import { isoToDatePickerValue } from "@/lib/datetime";
export interface FormProps<T extends FieldValues = FieldValues>
  extends UseControllerProps<T>,
    Omit<React.HTMLAttributes<HTMLInputElement>, "defaultValue"> {
  id?: string;
  label?: string;
  placeholder?: string;
  icon?: string | ReactElement;
  type?: string;
  width?: string;
  height?: string;
}

/*
This is a component for the HTML `<input>' tag
Input:
  id: The ID for the the input
  label: The label displayed on the text box
  placeholder: The placeholder message displayed on the text box
  icon: An optional Image path to display an .svg file
Output:
  A input text box that is compatible w/ React-hook-forms
*/

export default function FieldInput<T extends FieldValues = FieldValues>({
  id,
  label,
  placeholder,
  icon,
  type,
  width = "w-full",
  height = "min-h-10",
  ...props
}: FormProps<T>) {
  const { field, fieldState } = useController(props);
  const baseStyle = `relative flex ${width} ${height} mb-2 justify-between rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 border shadow-sm hover:shadow-grey-300`;
  // const baseStyle = `relative mb-2 flex h-10 ${width} flex-row items-center justify-between rounded-lg border px-3 shadow hover:shadow-grey-300`;
  const errorBorderStyle = `border-red-500`;
  const normalBorderStyle = `border-grey-300`;
  const inputStyle = `mr-1 w-full h-full text-sm placeholder:text-gray-500 focus:outline-none focus:ring-0`;
  // format it like YYYY-MM-DDThh:mm

  const displayIcon = (icon: string | ReactElement) => {
    if (typeof icon == "string") {
      return (
        <Image
          src={icon}
          alt="icon"
          width={16}
          height={16}
          className="relative min-h-0 w-4 min-w-0 shrink-0"
        />
      );
    } else {
      return icon;
    }
  };

  const convertedValue =
    field.value && type === "datetime-local"
      ? isoToDatePickerValue(new Date(field.value))
      : field.value;

  return (
    <div
      className={`${baseStyle} ${
        fieldState.invalid ? `${errorBorderStyle}` : `${normalBorderStyle}`
      }`}
    >
      <Label label={!label ? props.name : label} {...props} />
      <input
        type={!type ? "text" : `${type}`}
        className={inputStyle}
        placeholder={!placeholder ? `Enter ${props.name}` : `${placeholder}`}
        id={!id ? `${props.name}` : `${id}`}
        {...field}
        value={convertedValue}
        onChange={(e) => {
          const value =
            type === "datetime-local"
              ? new Date(e.target.value).toISOString()
              : e.target.value;
          field.onChange(value);
        }}
      />
      {icon && displayIcon(icon)}
      {fieldState.invalid && <Error {...props} />}
    </div>
  );
}
