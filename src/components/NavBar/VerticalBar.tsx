import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { VscChromeClose, VscMenu } from "react-icons/vsc";

import { MenuItems } from "@/components/NavBar";

interface NavItems {
  menuItems: MenuItems[];
  isLoggedIn: boolean;
  onSignOut: () => void;
}

const VerticalBar = (props: NavItems) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Close the sidebar if screen width is 768px or more
    const checkScreenWidth = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    // Close the sidebar if a user navigates to other page
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", checkScreenWidth);
    router.events.on("routeChangeStart", handleRouteChange);

    checkScreenWidth();

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <div className="relative">
      <button onClick={toggleSidebar}>
        {isOpen ? <VscChromeClose size="28" /> : <VscMenu size="28" />}
      </button>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-[60px] z-9  inset-0 w-screen h-screen bg-white">
          {props.menuItems.map((item) => (
            <Link href={item.path} key={item.item}>
              <p
                className={`block p-4 border-b hover:bg-app-base-100 ${
                  router.asPath === item.path ? "text-primary-700" : ""
                }`}
              >
                {item.item}
              </p>
            </Link>
          ))}
          {props.isLoggedIn && (
            <Link
              href="/repair-request"
              className="block p-4 border-b bg-app-primary hover:bg-app-primary-focus text-white"
            >
              New Repair Request +
            </Link>
          )}
          <div className="flex bottom-4">
            {props.isLoggedIn ? (
              <button
                onClick={props.onSignOut}
                className="w-full p-4 border-b bg-app-accent hover:bg-app-accent-focus"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="w-full p-4 border-b bg-app-accent hover:bg-app-accent-focus"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default VerticalBar;
