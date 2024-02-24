import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/Button";
import FieldInput from "@/components/FormFields/field-input";
import FieldRadio from "@/components/FormFields/field-radio";
import FieldSingleSelect from "@/components/FormFields/field-single-select";
import FieldTextArea from "@/components/FormFields/field-text-area";
import Toast from "@/components/Toast";
import { ItemType, useItemTypes } from "@/hooks/item-types";
import { useUpdateRepairRequest } from "@/hooks/repair-request";
import { updateRepairRequestSchema } from "@/schema/repair-request";
import type { GeneralRepairAttempt, RepairRequestResponse } from "@/types";
import { formatDate } from "@/utils";

export default function RepairAttempt({
  props
}: {
  props: RepairRequestResponse;
}) {
  const { mutate: updateRepairRequest } = useUpdateRepairRequest(
    props.id as string
  );

  const { data: itemTypes } = useItemTypes();

  let isSparePartsNeeded;
  props.spareParts == ""
    ? (isSparePartsNeeded = "")
    : (isSparePartsNeeded = "true");

  const { watch, control, handleSubmit } = useForm<GeneralRepairAttempt>({
    resolver: zodResolver(updateRepairRequestSchema),
    defaultValues: {
      item: props.itemType,
      itemBrand: props.itemBrand,
      itemMaterial: props.itemMaterial,
      hoursWorked: Number(props.hoursWorked),
      isRepaired: undefined,
      isSparePartsNeeded: isSparePartsNeeded,
      spareParts: props.spareParts,
      repairComment: props.repairComment
    }
  });

  const watchIsSparePartsNeeded = watch("isSparePartsNeeded");

  let textAreaHeight;
  watchIsSparePartsNeeded == "true"
    ? (textAreaHeight = "h-36 min-h-36")
    : (textAreaHeight = "h-full");

  const onSubmit: SubmitHandler<GeneralRepairAttempt> = async (data) => {
    updateRepairRequest(data);
  };

  return (
    <main className="sm:mx-10 md:mx-16 mx-5 border-0 border-blue-500 h-fit">
      <h4 className="flex justify-center text-xl max-[860px]:text-lg max-[640px]:text-base font-bold text-primary-500 pb-2">
        Repair Request ID: {props.id}
      </h4>
      <h4 className="flex justify-center text-xl max-[860px]:text-lg max-[640px]:text-base font-bold text-primary-500 max-[860px]:pb-0 pb-2">
        Requested By: {props.createdBy.firstName} {props.createdBy.lastName} on{" "}
        {formatDate(String(props.requestDate))}
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-0 border-green-500"
      >
        {/* ID, Item */}
        <div className="m-0 flex flex-col gap-6 sm:m-5 md:mt-5 lg:mt-10 xl:mx-14">
          <div className="flex flex-col m-auto w-3/4 gap-2 max-[415px]:m-2 mt-2">
            <FieldSingleSelect
              name="item"
              placeholder="eg. Computer, Bike..."
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
            <FieldInput
              name="itemBrand"
              label="Brand"
              placeholder="eg. Alienware..."
              control={control}
              rules={{ required: true }}
            />
            <FieldInput
              name="itemMaterial"
              label="Material"
              placeholder="e.g. Wood, Metal, Plastic..."
              control={control}
              rules={{ required: true }}
            />
          </div>

          {/* Spare parts needed?, Part(s) needed */}
          <div className="flex w-full flex-row justify-center gap-4 max-[415px]:gap-3">
            {/* Time it took, Repaired? */}
            <FieldRadio
              name="isRepaired"
              width="w-[33%]"
              height="min-h-10 max-[960px]:min-h-20"
              axis="flex-col sm:flex-row"
              control={control}
              label="Repaired?"
              rules={{ required: true }}
            />
            <FieldInput
              name="hoursWorked"
              label="Hours taken"
              width="w-[33%]"
              height="min-h-10"
              placeholder="Time in hours, e.g. 1.5..."
              control={control}
              rules={{ required: true }}
            />
            <FieldRadio
              name="isSparePartsNeeded"
              width="w-[33%]"
              height="min-h-10 max-[960px]:min-h-20"
              axis="flex-col sm:flex-row"
              labelYPosition="-top-10 sm:-top-3 max-[450px]:-top-10"
              control={control}
              label="Spare parts needed?"
              rules={{ required: true }}
            />
          </div>
          <div className="flex flex-col gap-4 h-56">
            {watchIsSparePartsNeeded === "true" && (
              <FieldInput
                name="spareParts"
                label="Parts needed"
                placeholder="e.g. 2x screws..."
                control={control}
                rules={{
                  required: watchIsSparePartsNeeded === "true" ? true : false
                }}
              />
            )}

            {/* Repair Comment */}
            <FieldTextArea
              name="repairComment"
              label="Repair Comment"
              placeholder="Describe the repair job in detail..."
              height={textAreaHeight}
              control={control}
              rules={{ required: true }}
            />
          </div>
        </div>
        {/* Submit */}
        <div className="relative bottom-0 border-0 border-red-500 lg:mt-8 mt-6 w-full">
          <Button
            height="h-12"
            width="w-full"
            textSize="text-lg"
            textWeight="font-semibold"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </div>
      </form>
      <Toast />
    </main>
  );
}
