import { useRouter } from "next/router";

import ProfilePopover from "@/components/ProfilePopover";
import { UserRole } from "@/types";
import Link from "next/link";

interface Props {
  role: UserRole;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

const adminRoles = [
  UserRole.ADMIN,
  UserRole.ORGANISATION_MANAGER,
  UserRole.EVENT_MANAGER
];

export default function Account({
  role,
  isLoggedIn,
  onSignOut
}: Readonly<Props>) {
  const router = useRouter();

  return (
    <div className="flex items-center">
      {isLoggedIn ? (
        <>
          <Link
            href="/repair-request"
            className="flex items-center justify-center px-2 mx-4 placeholder:w-[160px] h-[40px]  rounded-full bg-primary-700 text-white font-medium outline-none hover:bg-primary-800"
          >
            New Repair Request +
          </Link>

          <ActionButton onClick={onSignOut} label="Log Out" />

          <ProfilePopover />
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
      className="w-[160px] h-[60px] rounded-lg font-medium outline-none text-black hover:text-primary-700"
    >
      {label}
    </button>
  );
}
