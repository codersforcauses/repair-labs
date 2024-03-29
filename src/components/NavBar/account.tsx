import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";

import Modal from "@/components/Modal";
import ProfilePopover from "@/components/ProfilePopover";
import { UserRole } from "@/types";

interface Props {
  role: UserRole;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

export default function Account({ isLoggedIn, onSignOut }: Readonly<Props>) {
  const router = useRouter();

  const [ShowConfirmLogOut, setShowConfirmLogOut] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false); // Add state for icon hover

  function confirmLogOut() {
    setShowConfirmLogOut(true);
  }

  function hideConfirmLogOut() {
    setShowConfirmLogOut(false);
  }

  return (
    <div className="flex items-center sm:ml-2 md:ml-4 lg:ml-12">
      {isLoggedIn ? (
        <>
          <div className="group relative flex flex-col items-center justify-center mx-4">
            <Link
              href="/repair-request"
              className="flex items-center justify-center px-2 h-[40px] rounded-full bg-primary-700 text-white font-medium outline-none hover:bg-primary-800 transition-all duration-300 ease-in-out"
            >
              {/* Adaptively visible text */}
              <span className="hidden truncate md:hidden lg:flex placeholder:w-[160px] text-xs md:text-sm lg:text-sm transition-all duration-300 ease-in-out text-clip">
                New Repair Request +
              </span>
              {/* Icon with conditional visibility and size adjustment. Add onMouseEnter and onMouseLeave */}
              <div
                onMouseEnter={() => setIsIconHovered(true)}
                onMouseLeave={() => setIsIconHovered(false)}
                className="lg:hidden"
              >
                <FaPlus className="w-[40px]" />
              </div>
            </Link>
            {/* Modify condition for displaying hover text to depend on isIconHovered state */}
            {isIconHovered && (
              <span className="w-[220px] opacity-100 mt-2 bg-primary-700 text-white py-1 px-2 rounded-md absolute top-full text-center lg:hidden">
                New Repair Request +
              </span>
            )}
          </div>

          <ActionButton onClick={confirmLogOut} label="Log Out" />
          <Modal
            title="Are you sure you want to logout?"
            showModal={ShowConfirmLogOut}
            setShowPopup={setShowConfirmLogOut}
          >
            <div className="text-center">
              <ActionButton onClick={onSignOut} label="Yes" />
              <ActionButton onClick={hideConfirmLogOut} label="No" />
            </div>
          </Modal>
          <div className="sm:ml-2 md:ml-4 lg:ml-12">
            <ProfilePopover />
          </div>
        </>
      ) : (
        <ActionButton onClick={() => router.push("/login")} label="Sign In" />
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  label
}: Readonly<{
  onClick: () => void;
  label: string;
}>) {
  return (
    <button
      onClick={onClick}
      className="h-[60px] rounded-lg whitespace-nowrap sm:ml-2 md:ml-4 lg:ml-12 font-medium outline-none text-black hover:text-primary-700"
    >
      {label}
    </button>
  );
}
