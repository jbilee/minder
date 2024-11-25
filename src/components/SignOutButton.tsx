"use client";

import { useClerk } from "@clerk/nextjs";

export default function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <span className="cursor-pointer" onClick={() => signOut({ redirectUrl: "/" })}>
      Logout
    </span>
  );
}
