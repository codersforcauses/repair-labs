import { useForm } from "react-hook-form";

import FieldSingleSelect from "@/components/FormFields/field-single-select";

export interface Filter {
  title: string;
  name: string;
  options: Array<{
    text: string;
    id: string;
  }>;
}

export interface FilterGroupProps {
  filters: Filter[];
  value?: Record<string, string | string[]>;
  onChange?: (nextState: Record<string, string | string[] | undefined>) => void;
}

export default function FilterGroup({ filters }: FilterGroupProps) {
  const { control } = useForm();
  return (
    <div className="flex flex-row gap-4 p-4">
      {filters?.map(({ name, options }) => (
        <div key={name} className="w-24">
          <FieldSingleSelect name={name} options={options} control={control} />
        </div>
      ))}
    </div>
  );
}
