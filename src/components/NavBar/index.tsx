import { UserRole } from "@/types";
import MenuList from "@/components/NavBar/menu-list";
import { useAuth } from "@/hooks/auth";
import Account from "@/components/NavBar/account";

const adminItems = ["Home", "Events", "Repair Requests"];
const clientItems = ["Home", "My Events"];

const pathMap: { [key: string]: string } = {
  Home: "/",
  Events: "/events",
  "Repair Requests": "/repair-requests",
  "My Events": "/my-events"
};

const adminRoles = [
  UserRole.ADMIN,
  UserRole.ORGANISATION_MANAGER,
  UserRole.EVENT_MANAGER
];

export default function NavBar() {
  const { role, isLoaded, user } = useAuth();
  return (
    <div className="h-[60px] leading-[60px] text-lg bg-lightAqua-300">
      {isLoaded && (
        <>
          <div className="flex flex-row">
            <MenuList
              items={
                adminRoles.includes(role)
                  ? adminItems.map((item) => ({
                      item,
                      path: pathMap[item]
                    }))
                  : clientItems.map((item) => ({
                      item,
                      path: pathMap[item]
                    }))
              }
            />
            <Account name={"JOHN"}></Account>
          </div>
        </>
      )}
    </div>
  );
}
