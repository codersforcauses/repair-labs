import { zodResolver } from "@hookform/resolvers/zod";
import { ItemType, RepairStatus } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/Button";
import FieldCheckbox from "@/components/check-box";
import FieldInput from "@/components/FormFields/field-input";
import FieldSingleSelect from "@/components/FormFields/field-single-select";
import FieldTextArea from "@/components/FormFields/field-text-area";
import { updateRepairRequestSchema } from "@/schema/repair-request";
import type { GeneralRepairAttempt, Option } from "@/types";

const REPAIR_STATUS_OPTIONS: Option[] = [
  { id: RepairStatus.PENDING, text: "Pending" },
  { id: RepairStatus.REPAIRED, text: "Repaired" },
  { id: RepairStatus.FAILED, text: "Failed" }
];

export default function RepairAttemptForm({
  itemTypes,
  onSubmit
}: {
  itemTypes?: ItemType[];
  onSubmit?: SubmitHandler<GeneralRepairAttempt>;
}) {
  const { watch, control, handleSubmit } = useForm<GeneralRepairAttempt>({
    resolver: zodResolver(updateRepairRequestSchema),
    defaultValues: {
      itemType: "",
      itemBrand: "",
      itemMaterial: "",
      hoursWorked: undefined,
      status: RepairStatus.PENDING,
      isSparePartsNeeded: undefined,
      spareParts: "",
      repairComment: ""
    }
  });

  let actualItemTypes;
  itemTypes
    ? (actualItemTypes = itemTypes.map((type) => ({
        id: type.name,
        text: type.name
      })))
    : (actualItemTypes = [
        { id: 0, text: "Bike" },
        { id: 1, text: "Clock" },
        { id: 2, text: "Computer" }
      ]);

  const watchIsSparePartsNeeded = watch("isSparePartsNeeded");

  const defaultOnSubmit: SubmitHandler<GeneralRepairAttempt> = async (data) => {
    // console.log(JSON.stringify(data));
    const response = await fetch(`/api/repair-request`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert("Data submitted");
    } else {
      alert(`Error! ${response.statusText}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit ? onSubmit : defaultOnSubmit)}>
      {/* ID, Item */}
      <div className="m-5 flex flex-wrap gap-2 max-[415px]:m-2">
        <FieldSingleSelect
          name="itemType"
          control={control}
          rules={{ required: true }}
          options={actualItemTypes}
        />

        {/* Brand, Material */}
        <FieldInput
          name="itemBrand"
          label="Brand"
          control={control}
          rules={{ required: true }}
        />
        <FieldInput
          name="itemMaterial"
          label="Material"
          placeholder="e.g. Wood, Metal, Plastic"
          control={control}
          rules={{ required: true }}
        />

        {/* Time it took, Repaired? */}
        <FieldInput
          name="hoursWorked"
          label="Time it took"
          placeholder="Time in hours, e.g. 1.5"
          control={control}
          rules={{ required: true }}
        />

        {/* Spare parts needed?, Part(s) needed */}
        <div className="flex w-full flex-row gap-8 max-[415px]:gap-3">
          <FieldSingleSelect
            name="status"
            control={control}
            options={REPAIR_STATUS_OPTIONS}
            label="Status"
          />

          <FieldCheckbox
            name="isSparePartsNeeded"
            control={control}
            label="Spare parts needed?"
            rules={{ required: true }}
          />
        </div>

        {watchIsSparePartsNeeded === "true" && (
          <FieldInput
            name="spareParts"
            label="Parts needed"
            placeholder="e.g. 2x screws"
            control={control}
            rules={{
              required: watchIsSparePartsNeeded === "true" ? true : false
            }}
          />
        )}

        {/* Job Description */}
        <FieldTextArea
          name="repairComment"
          label="Job Description"
          placeholder="Describe the repair job in detail"
          control={control}
          rules={{ required: true }}
        />
      </div>

      {/* Submit */}
      <div className="my-5 flex flex-row">
        <Button onClick={handleSubmit(onSubmit ? onSubmit : defaultOnSubmit)}>
          Submit
        </Button>
      </div>
    </form>
  );
}
