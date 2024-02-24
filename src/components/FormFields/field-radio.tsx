import {
  FieldValues,
  useController,
  UseControllerProps
} from "react-hook-form";

import Label from "@/components/FormFields/box-label";
import Error from "@/components/FormFields/error-msg";

export interface FormProps<T extends FieldValues = FieldValues>
  extends UseControllerProps<T>,
    Omit<React.HTMLAttributes<HTMLInputElement>, "defaultValue"> {
  id?: string;
  label?: string;
  width?: string;
  height?: string;
  axis?: string;
  labelYPosition?: string;
}

/*
This is a component for the HTML `<radio>' tag
Will display 2 radio buttons asking displaying 'Yes' or 'No'
Input:
  ID : The ID for the radio box
  label: The label displayed on the text box
Output:
  A input radio option box for a 'yes' or 'no' question that is compatible w/ React-hook-forms 
*/
export default function FieldRadio<T extends FieldValues = FieldValues>({
  id,
  label,
  width = "w-full",
  height = "min-h-10",
  axis = "flex-row",
  labelYPosition = "-top-3",
  ...props
}: FormProps<T>) {
  const { field, fieldState } = useController(props);
  const baseStyle = `relative flex ${width} ${height} mb-2 items-center justify-between rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 border shadow-sm hover:shadow-grey-300`;
  // const baseStyle = `relative mb-2 flex h-10 ${width} flex-row items-center justify-between rounded-lg border px-3 shadow hover:shadow-grey-300`;
  const errorBorderStyle = `border-red-500`;
  const normalBorderStyle = `border-grey-300`;
  const radioStyle = `my-auto flex ${axis} items-start gap-4 text-xs`;

  return (
    <div
      className={`${baseStyle} ${
        fieldState.invalid ? `${errorBorderStyle}` : `${normalBorderStyle}`
      }`}
    >
      <Label
        label={!label ? props.name : label}
        yPosition={`${labelYPosition}`}
        {...props}
      />
      <div className={radioStyle}>
        <label htmlFor={`${props.name}-y`} className="flex gap-1">
          <input
            {...field}
            type="radio"
            value="true"
            id={!id ? `${props.name}-y` : `${id}-y`}
            checked={field.value == "true" ? true : false}
          />
          Yes
        </label>

        <label htmlFor={`${props.name}-n`} className="flex gap-1">
          <input
            {...field}
            type="radio"
            value="false"
            id={!id ? `${props.name}-n` : `${id}-n`}
            checked={field.value == "false" ? true : false}
          />
          No
        </label>
      </div>
      {fieldState.invalid && <Error {...props} />}
    </div>
  );
}
