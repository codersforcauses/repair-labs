import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/Button";
import FieldImageUpload from "@/components/FormFields/field-image-upload";
import SingleSelect from "@/components/FormFields/field-single-select";
import FieldTextArea from "@/components/FormFields/field-text-area";
import { TermsAndConditions } from "@/components/terms-and-conditions";
import { Brand, useBrands } from "@/hooks/brands";
import { EventOption, useEventOptions } from "@/hooks/events";
import { ItemType, useItemTypes } from "@/hooks/item-types";
import { useCreateRepairRequest } from "@/hooks/repair-request";
import generateThumbnail from "@/lib/gen-thumbnail";
import uploadImage from "@/lib/upload-image";
import { createRepairRequestSchema } from "@/schema/repair-request";
import { CreateRepairRequest } from "@/types";

export interface FormValues extends CreateRepairRequest {
  tncAccepted: boolean;
}

const repairRequestFormSchema = createRepairRequestSchema.extend({
  tncAccepted: z.boolean().refine((val) => !!val, {
    message: "Please read through and accept the house rules."
  })
});

export default function RepairRequestForm({ eventId }: { eventId?: string }) {
  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    resolver: zodResolver(repairRequestFormSchema),
    defaultValues: {
      itemBrand: "",
      itemType: "",
      description: "",
      images: [],
      eventId: eventId || "",
      comment: "",
      tncAccepted: false
    }
  });

  const { data: itemTypeList } = useItemTypes();
  const { data: brandList } = useBrands();
  const { data: eventOptions } = useEventOptions();
  const { mutateAsync: createRepairRequest } = useCreateRepairRequest();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const uploadPromises =
      data.images?.map((image) => uploadImage(image)) ?? [];
    const uploadThumbailPromise = data.images?.[0]
      ? generateThumbnail(data.images[0]).then(uploadImage)
      : undefined;
    const keys = await Promise.all([uploadThumbailPromise, ...uploadPromises]);
    const [thumbnailImage, ...images] = keys;
    const updatedData = { ...data, thumbnailImage, images };

    const response = await createRepairRequest(updatedData);

    router.push(`/request-success/${response.id}`);

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Input field for Brand of Item */}
      <SingleSelect
        name="itemBrand"
        control={control}
        placeholder="Select a brand..."
        label="Brand"
        rules={{ required: true }}
        options={
          brandList
            ? brandList.map((brand: Brand) => {
                return { id: brand.name, text: brand.name };
              })
            : []
        }
      />
      <SingleSelect
        name="itemType"
        control={control}
        placeholder="Select an item type..."
        label="Item Type"
        rules={{ required: true }}
        options={
          itemTypeList
            ? itemTypeList.map((itemType: ItemType) => {
                return { id: itemType.name, text: itemType.name };
              })
            : []
        }
      />
      {/* Input field for Description of Item */}
      <FieldTextArea
        name="description"
        label="Description"
        placeholder="Enter a description..."
        control={control}
        rules={{ required: true }}
      />

      <FieldImageUpload multiple name="images" control={control} />
      <p className="text-center">(psst you can upload multiple images)</p>
      {/* Input field for Event */}
      {!eventId && (
        <SingleSelect
          name="eventId"
          control={control}
          placeholder="Select an event..."
          label="Event"
          options={
            eventOptions
              ? eventOptions.map((event: EventOption) => {
                  return { id: event.id, text: event.name };
                })
              : []
          }
        />
      )}
      <FieldTextArea
        name="comment"
        label="Additional Comment"
        placeholder="Anything else we should know?"
        control={control}
        rules={{ required: false }}
      />
      <TermsAndConditions setValue={setValue} control={control} />
      <Button
        type="submit"
        height="h-12"
        width="w-full"
        textSize="text-lg"
        textWeight="font-semibold"
      >
        Submit
      </Button>
    </form>
  );
}
