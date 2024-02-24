import {
  FieldValues,
  useController,
  UseControllerProps
} from "react-hook-form";

import Label from "@/components/FormFields/box-label";
import Error from "@/components/FormFields/error-msg";
export interface FormProps<T extends FieldValues = FieldValues>
  extends UseControllerProps<T>,
    Omit<React.HTMLAttributes<HTMLTextAreaElement>, "defaultValue"> {
  id?: string;
  label?: string;
  placeholder?: string;
  icon?: string;
  width?: string;
  height?: string;
}

/*
This is a component for the HTML `<textarea>' tag
Input:
  label: The label displayed on the text box
  placeholder: The placeholder message displayed on the text box
Output:
  A large text box that is compatible w/ React-hook-forms
*/
export default function FieldTextArea<T extends FieldValues = FieldValues>({
  id,
  label,
  placeholder,
  width = "w-full",
  height = "h-36",
  ...props
}: FormProps<T>) {
  const { field, fieldState } = useController(props);

  // const baseStyle = `relative mb-2 flex ${height} ${width} flex-row items-center justify-between rounded-lg border border-grey-300 px-3 shadow hover:shadow-grey-300`;
  const baseStyle = `relative flex ${height} ${width} justify-between rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-gray-900 shadow-sm border border-grey-300 hover:shadow-grey-300`;
  const errorBorderStyle = `border-red-500`;
  const normalBorderStyle = `border-grey-300`;
  const textAreaStyle = `overflow-wrap:break-word pt-3 h-full w-full resize-none overflow-y-auto text-sm placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:ring-0`;

  return (
    <div
      className={`${baseStyle} ${
        fieldState.invalid ? `${errorBorderStyle}` : `${normalBorderStyle}`
      }`}
    >
      <Label label={!label ? props.name : label} {...props} />
      <textarea
        className={textAreaStyle}
        placeholder={!placeholder ? `Enter ${props.name}` : placeholder}
        id={!id ? props.name : id}
        {...field}
      />
      {fieldState.invalid && <Error {...props} />}
    </div>
  );
}
