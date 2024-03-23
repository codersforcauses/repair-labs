import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/Button";
import FieldInput from "@/components/FormFields/field-input";
import FieldRadio from "@/components/FormFields/field-radio";
import FieldSingleSelect from "@/components/FormFields/field-single-select";
import FieldTextArea from "@/components/FormFields/field-text-area";
import { Brand, useBrands } from "@/hooks/brands";
import { ItemType, useItemTypes } from "@/hooks/item-types";
import { updateRepairRequestSchema } from "@/schema/repair-request";
import type { GeneralRepairAttempt, RepairRequestResponse } from "@/types";

export default function PrepopulatedRepairAttemptForm({
  props,
  onSubmit
}: {
  props: RepairRequestResponse;
  onSubmit: SubmitHandler<GeneralRepairAttempt>;
}) {
  const { data: itemTypes } = useItemTypes();
  const { data: itemBrands } = useBrands();

  let status;
  switch (props.status) {
    case "REPAIRED":
      status = "true";
      break;
    case "FAILED":
    case "PENDING":
      status = "false";
  }

  let isSparePartsNeeded;
  props.spareParts == ""
    ? (isSparePartsNeeded = "false")
    : (isSparePartsNeeded = "true");

  const { watch, control, handleSubmit } = useForm<GeneralRepairAttempt>({
    resolver: zodResolver(updateRepairRequestSchema),
    defaultValues: {
      itemType: props.itemType,
      itemBrand: props.itemBrand,
      itemMaterial: props.itemMaterial,
      hoursWorked: Number(props.hoursWorked),
      isRepaired: status,
      isSparePartsNeeded: isSparePartsNeeded,
      spareParts: props.spareParts,
      repairComment: props.repairComment
    }
  });

  const watchIsSparePartsNeeded = watch("isSparePartsNeeded");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ID, Item */}
      <div className="m-5 flex flex-wrap gap-2 max-[415px]:m-2">
        <FieldSingleSelect
          name="itemType"
          control={control}
          rules={{ required: true }}
          options={
            itemTypes
              ? itemTypes.map((itemType: ItemType) => {
                  return { id: itemType.name, text: itemType.name };
                })
              : []
          }
        />

        {/* Brand, Material */}
        <FieldSingleSelect
          name="itemBrand"
          label="Brand"
          control={control}
          rules={{ required: true }}
          options={
            itemBrands
              ? itemBrands.map((brand: Brand) => {
                  return { id: brand.name, text: brand.name };
                })
              : []
          }
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
          <FieldRadio
            name="isRepaired"
            control={control}
            label="Repaired?"
            rules={{ required: true }}
          />

          <FieldRadio
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
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </form>
  );
}
