import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemType } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/Button";
import FieldInput from "@/components/FormFields/field-input";
import FieldSingleSelectInput from "@/components/FormFields/field-single-select-inputbox";
import FieldTextArea from "@/components/FormFields/field-text-area";
import { createEventSchema } from "@/schema/event";
import { CreateEvent } from "@/types";

export default function EventForm({
  itemTypes,
  onSubmit
}: {
  itemTypes: ItemType[];
  onSubmit: SubmitHandler<CreateEvent>;
}) {
  const { control, handleSubmit } = useForm<CreateEvent>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
      eventType: "",
      disclaimer: ""
      // volunteers: [""]
    }
  });
  const inputBox: ItemType = { name: "input-box-add" };
  itemTypes = [...itemTypes, inputBox];
  // TODO: Change the startDate and endDate input fields to use a date picker component.
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3 space-y-3">
          <FieldInput
            control={control}
            name="name"
            label="Event Name"
          ></FieldInput>

          <FieldSingleSelectInput
            control={control}
            name="eventType"
            label="Event Type"
            placeholder="Select type"
            options={itemTypes.map((type) => ({
              id: type.name,
              text: type.name
            }))}
          ></FieldSingleSelectInput>

          <FieldTextArea
            name="description"
            label="Description"
            placeholder="Enter a description for the event"
            control={control}
            rules={{ required: false }}
          />

          <FieldInput
            control={control}
            name="location"
            label="Location"
          ></FieldInput>

          <FieldInput
            control={control}
            name="startDate"
            label="Start Date"
            type="datetime-local"
          ></FieldInput>

          <FieldInput
            control={control}
            name="endDate"
            label="End Date"
            type="datetime-local"
          ></FieldInput>

          <FieldTextArea
            name="disclaimer"
            label="Disclaimer"
            placeholder="Enter a disclaimer for the event"
            control={control}
            rules={{ required: false }}
          />

          {/* <FieldMultiSelect
            control={control}
            name="volunteers" 
            label="Volunteers"
            options={itemTypes.map((type) => ({
              id: type.name,
              text: type.name
            }))}
          ></FieldMultiSelect>*/}
        </div>
        {/* Submit */}
        <div className="my-5 flex flex-row">
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </div>
      </form>
    </>
  );
}
