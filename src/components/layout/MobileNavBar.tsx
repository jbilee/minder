import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { RiHome5Line, RiMindMap, RiSettings3Line } from "react-icons/ri";
import SignOutIcon from "@/components/SignOutIcon";

export default async function MobileNavBar() {
  let user = null;
  try {
    user = await currentUser();
  } catch (e) {
    // Log
  }
  return user ? (
    <div className="sm:hidden fixed bottom-0 w-full p-4 rounded-t-2xl shadow-[0_-2px_15px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-800">
      <ul className="flex justify-center gap-8">
        <li>
          <Link href="/">
            <RiHome5Line size="1.75rem" />
          </Link>
        </li>
        <li>
          <Link href="/maps">
            <RiMindMap size="1.75rem" />
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <RiSettings3Line size="1.75rem" />
          </Link>
        </li>
        <li>
          <SignOutIcon />
        </li>
      </ul>
    </div>
  ) : (
    <div className="sm:hidden fixed bottom-6 flex justify-center w-full">
      <Link
        href="/signin"
        className="px-7 py-3 rounded-full text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      >
        Get started
      </Link>
    </div>
  );
}
