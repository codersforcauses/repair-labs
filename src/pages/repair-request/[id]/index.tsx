import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { RepairStatus } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/Button";
import FieldInput from "@/components/FormFields/field-input";
import FieldRadio from "@/components/FormFields/field-radio";
import FieldTextArea from "@/components/FormFields/field-text-area";
import Toast from "@/components/Toast";
import { useUpdateRepairRequest } from "@/hooks/repair-request";
import { updateRepairRequestSchema } from "@/schema/repair-request";
import type { GeneralRepairAttempt } from "@/types";

const inter = Inter({ subsets: ["latin"] });

export default function RepairAttempt() {
  const {
    query: { id }
  } = useRouter();

  const { mutate: updateRepairRequest } = useUpdateRepairRequest(id as string);

  const { watch, control, handleSubmit } = useForm<GeneralRepairAttempt>({
    resolver: zodResolver(updateRepairRequestSchema),
    defaultValues: {
      itemType: "",
      itemBrand: "",
      itemMaterial: "",
      hoursWorked: 1,
      repairStatus: undefined,
      isSparePartsNeeded: undefined,
      spareParts: "",
      repairComment: ""
    }
  });

  const watchIsSparePartsNeeded = watch("isSparePartsNeeded");

  const onSubmit: SubmitHandler<GeneralRepairAttempt> = async (data) => {
    updateRepairRequest(data);
  };

  return (
    <main
      className={`flex flex-col items-center gap-4 rounded-lg border-2 border-teal-300 bg-white shadow-md max-[768px]:m-7 md:mx-auto md:my-7 md:w-[768px]  ${inter.className}`}
    >
      <h1 className="w-full rounded-t-lg bg-[#d9d9d9] px-5 py-3 text-3xl font-semibold leading-normal  text-grey-950 max-[415px]:text-center max-[415px]:text-lg">
        General Repair Attempt
        <p>ID: {id}</p>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ID, Item */}
        <div className="m-5 flex flex-wrap gap-2 max-[415px]:m-2">
          <FieldInput
            name="itemType"
            control={control}
            rules={{ required: true }}
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
            <FieldRadio
              name="repairStatus"
              control={control}
              label="Repaired?"
              trueValue={RepairStatus.REPAIRED}
              falseValue={RepairStatus.FAILED}
              rules={{ required: true }}
            />

            <FieldRadio
              name="isSparePartsNeeded"
              control={control}
              label="Spare parts needed?"
              trueValue="true"
              falseValue="false"
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

          {/* Repair Comment */}
          <FieldTextArea
            name="repairComment"
            label="Repair Comment"
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
      <Toast />
    </main>
  );
}
