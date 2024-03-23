import { useEffect, useState } from "react";
import Image from "next/image";
import { UserResource } from "@clerk/types";
import { Popover, Transition } from "@headlessui/react";
import { GoCheck, GoPencil, GoX } from "react-icons/go";
import SkillDropdown from "@/components/DropDown/skill-dropdown";

import { useAuth } from "@/hooks/auth";

async function updateUserMetadata(user: UserResource, description: string) {
  await user.update({ unsafeMetadata: { description } });
}

export default function ProfilePopover() {
  const { user, role } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState(
    String(user?.unsafeMetadata.description) || ""
  );
  const [initialDescription, setInitialDescription] = useState(description);

  useEffect(() => {
    setDescription((user?.unsafeMetadata.description as string) || "");
  }, [user?.unsafeMetadata.description]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 200) {
      setDescription(newValue);
    }
  };

  const handleEditClick = () => {
    setIsEdit(!isEdit);
    if (!isEdit) {
      setInitialDescription(description);
    }
  };

  const handleCancelClick = () => {
    setDescription(initialDescription);
    setIsEdit(false);
  };

  const handleSaveClick = async () => {
    if (user) {
      try {
        await updateUserMetadata(user, description);
        setIsEdit(false);
      } catch (error) {
        // Not really sure how we're handling errors in repair lab so feel free to let me know, consider this a placeholder
        // eslint-disable-next-line no-console
        console.error("Failed to update user metadata:", error);
      }
    } else {
      // Same as above
      // eslint-disable-next-line no-console
      console.error("User data is not available");
    }
  };

  return (
    <Popover className="flex">
      <Popover.Button>
        <div className="focus:outline-none mx-auto outline-none rounded-full h-12 w-12 relative">
          {user?.imageUrl && (
            <Image
              alt="user avatar"
              src={user.imageUrl}
              layout="fill"
              objectFit="cover"
              className="rounded-full "
            />
          )}
        </div>
      </Popover.Button>
      <Transition
        as={Popover.Panel}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute top-[62px] right-5 w-80 rounded-lg bg-white z-10 shadow-custom">
          <div className="flex flex-col items-center p-4">
            <div className="relative w-28 h-28 rounded-full my-6">
              {user?.imageUrl && (
                <Image
                  alt="user avatar"
                  src={user.imageUrl}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              )}
            </div>

            <div className="text-center">
              <div className="text-2xl font-semibold">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xl text-slate-500">
                {String(role).charAt(0).toUpperCase() +
                  String(role).slice(1).toLowerCase()}
              </div>
            </div>
            <div className="self-start w-full pl-2 mb-2 mt-4 text-sm">
              I can repair...
            </div>
            <div className="w-full">
              <SkillDropdown />
            </div>

            <div
              className={`relative mx-auto mt-5 w-72 h-24 border-2 rounded-md ${
                isEdit
                  ? "border-lightAqua-200 bg-white"
                  : "border-slate-300 bg-slate-50 text-slate-500"
              }`}
            >
              <textarea
                ref={(textareaRef) =>
                  textareaRef && isEdit && textareaRef.focus()
                }
                disabled={!isEdit}
                value={description ?? ""}
                className={`no-scrollbar resize-none w-full h-2/3 p-2 outline-none text-slate-80 rounded-xl ${
                  isEdit ? "bg-white" : "bg-slate-50"
                }`}
                onChange={handleChange}
                onFocus={(e) =>
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length
                  )
                }
              />
              <span className="absolute bottom-1 right-3">
                {!isEdit ? (
                  <button
                    className="text-l space-x-1 text-primary-600"
                    onClick={handleEditClick}
                  >
                    <GoPencil className="inline text-xl" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <span className="space-x-2 text-2xl">
                    <button>
                      <GoCheck
                        strokeWidth="1.2"
                        className="inline text-green-500"
                        onClick={handleSaveClick}
                      />
                    </button>
                    <button>
                      <GoX
                        strokeWidth="1.2"
                        className="inline text-red-600"
                        onClick={handleCancelClick}
                      />
                    </button>
                  </span>
                )}
              </span>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
