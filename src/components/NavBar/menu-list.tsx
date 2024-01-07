import Link from "next/link";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";

import { NavPath } from "@/types";

interface Props {
  items: Array<NavPath>;
}

export default function MenuList({ items }: Readonly<Props>) {
  const router = useRouter();

  return (
    <Tab.Group>
      <Tab.List className="flex pl-1">
        {items.map((item) => (
          <Tab
            key={item.item}
            className={`mx-16 px-2 font-medium text-black hover:text-primary-700 ${
              router.asPath === item.path ? "text-primary-700" : ""
            }`}
            //
          >
            <Link href={item.path}>
              <div className="relative flex flex-col items-center justify-center h-full w-full">
                {item.item}
                {router.asPath === item.path && (
                  <span className="absolute -bottom-1 h-[3px] w-full bg-primary-700 rounded-full" />
                )}
              </div>
            </Link>
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
}
