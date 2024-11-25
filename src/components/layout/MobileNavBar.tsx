import Link from "next/link";
import { RiMindMap, RiSettings3Line } from "react-icons/ri";
import SignOutIcon from "@/components/SignOutIcon";

export default function MobileNavBar() {
  return (
    <div className="sm:hidden flex justify-around w-full p-4 sticky bottom-0 bg-white dark:bg-slate-800 border-t border-neutral-400 dark:border-slate-600">
      <li>
        <Link href="/maps">
          <RiMindMap size="2rem" />
        </Link>
      </li>
      <li>
        <Link href="/settings">
          <RiSettings3Line size="2rem" />
        </Link>
      </li>
      <li>
        <SignOutIcon />
      </li>
    </div>
  );
}
