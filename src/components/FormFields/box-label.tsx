import { FieldValues, UseControllerProps } from "react-hook-form";

export interface FormProps<T extends FieldValues = FieldValues>
  extends UseControllerProps<T> {
  label?: string;
  yPosition?: string;
}

/*
This is a component for the labels for each text box
Output:
  A <div> that contains the label for an input field
*/
export default function Label<T extends FieldValues = FieldValues>({
  label,
  yPosition = "-top-3",
  ...props
}: FormProps<T>) {
  return (
    <label
      className={`absolute ${yPosition} left-2 flex flex-row items-center gap-0.5 rounded-full bg-white px-1 text-s font-semibold text-black`}
    >
      {label}
      {props.rules?.required ? (
        <span className="text-xs font-semibold text-red-500"> *</span>
      ) : (
        ""
      )}
    </label>
  );
}
