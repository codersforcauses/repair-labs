// reusable modal component

import { Dispatch, Fragment, ReactNode, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiFillCloseCircle } from "react-icons/ai";
type ModalProps = {
  showModal: boolean;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
  title?: string | ReactNode;
  width?: string;
  height?: string;
  children?: ReactNode;
};

const Modal = ({
  showModal,
  setShowPopup,
  title,
  width = "w-full sm:max-w-lg md:max-w-2xl",
  height = "h-5/6",
  children
}: ModalProps) => {
  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          open={showModal}
          onClose={() => setShowPopup(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-grey-950 opacity-20" />
          </Transition.Child>

          <div className="fixed inset-0 h-full overflow-y-auto">
            <div className="flex h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`${width} ${height} overflow-auto transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
                >
                  {title ? (
                    <Dialog.Title
                      as={`${typeof title == "string" ? "h3" : "div"}`}
                      className="mt-0 border-b  border-gray-200 p-4 text-center text-3xl font-semibold leading-6 mb-5"
                    >
                      {title}
                    </Dialog.Title>
                  ) : (
                    ""
                  )}

                  {children}
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute right-2 top-2 rounded-lg p-1 hover:bg-gray-50"
                  >
                    <AiFillCloseCircle className="text-2xl" color="teal" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
