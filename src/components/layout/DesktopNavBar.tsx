import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import SignOutButton from "@/components/SignOutButton";

export default async function DesktopNavBar() {
  const { userId } = await auth();
  return (
    <div className="hidden sm:block w-full p-5 sticky top-0 bg-white dark:bg-slate-800 border-b border-neutral-300 dark:border-slate-600">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        {userId ? (
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
      </div>
    </div>
  );
}
