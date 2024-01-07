// Page for submitting a repair request

import Image from "next/image";
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
import { NextPageWithLayout } from "@/pages/_app";
import NavBar from "@/components/NavBar";

export interface FormValues extends CreateRepairRequest {
  tncAccepted: boolean;
}

const repairRequestFormSchema = createRepairRequestSchema.extend({
  tncAccepted: z.boolean().refine((val) => !!val, {
    message: "Please read through and accept the house rules."
  })
});

const RepairRequest: NextPageWithLayout = () => {
  const { control, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(repairRequestFormSchema),
    defaultValues: {
      itemBrand: "",
      itemType: "",
      description: "",
      images: [],
      eventId: "",
      comment: "",
      tncAccepted: false
    }
  });

  const { data: itemTypeList } = useItemTypes();
  const { data: brandList } = useBrands();
  const { data: eventOptions } = useEventOptions();
  const { mutate: createRepairRequest } = useCreateRepairRequest();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const uploadPromises =
      data.images?.map((image) => uploadImage(image)) ?? [];
    const uploadThumbailPromise = data.images?.[0]
      ? generateThumbnail(data.images[0]).then(uploadImage)
      : undefined;
    const keys = await Promise.all([uploadThumbailPromise, ...uploadPromises]);
    const [thumbnailImage, ...images] = keys;
    const updatedData = { ...data, thumbnailImage, images };
    createRepairRequest(updatedData);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex w-screen flex-col justify-center gap-4 md:w-3/6 lg:w-4/12">
        {/* Logo of Repair Lab, which links to the main website. */}

        <picture className="flex justify-center">
          <a href="https://repairlab.myfreesites.net/" target="_blank">
            <Image
              src="/images/repair_lab_logo.jpg"
              alt="Repair Labs Logo"
              width={80}
              height={80}
            />
          </a>
        </picture>

        {/* Heading of the Page */}

        <h1 className="flex justify-center text-xl font-bold">
          {" "}
          Submit a Repair Request
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Input field for Brand of Item */}

          <SingleSelect
            name="itemBrand"
            control={control}
            placeholder="Select a brand"
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
            placeholder="Select an item type"
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
            placeholder="Enter a description"
            control={control}
            rules={{ required: true }}
          />

          <FieldImageUpload multiple name="images" control={control} />

          {/* Input field for Event Date */}
          <SingleSelect
            name="eventId"
            control={control}
            placeholder="Select an event"
            label="Event"
            options={
              eventOptions
                ? eventOptions.map((event: EventOption) => {
                    return { id: event.id, text: event.name };
                  })
                : []
            }
          />

          <FieldTextArea
            name="comment"
            label="Additional Comment"
            placeholder="Enter additional comments"
            control={control}
            rules={{ required: false }}
          />

          <TermsAndConditions setValue={setValue} control={control} />

          <Button
            type="submit"
            height="h-9"
            width="w-full"
            textSize="text-base"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

RepairRequest.getLayout = function getLayout(page) {
  return (
    <>
      <NavBar />
      {page}
    </>
  );
};

export default RepairRequest;
