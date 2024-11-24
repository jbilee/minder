import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function DesktopNavBar() {
  const { userId } = await auth();
  return (
    <div className="w-full p-5 sticky top-0 bg-white border-b border-neutral-400">
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
            <li>Logout</li>
          </>
        ) : (
          <li className="ml-auto">Sign in</li>
        )}
      </div>
    </div>
  );
}
