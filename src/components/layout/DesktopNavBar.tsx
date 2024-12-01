import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import SignOutButton from "@/components/SignOutButton";

export default async function DesktopNavBar() {
  let user = null;
  try {
    user = await currentUser();
  } catch (e) {
    // Log
  }
  return (
    <div className="hidden sm:block w-full p-5 sticky top-0 bg-white dark:bg-slate-800 border-b border-neutral-300 dark:border-slate-600">
      <ul className="flex gap-4">
        <Link href="/">Home</Link>
        {user ? (
          <>
            <li className="ml-auto">
              <Link href="/maps">Maps</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <SignOutButton />
            </li>
          </>
        ) : (
          <li className="ml-auto">
            <Link href="/signin">Sign in</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
