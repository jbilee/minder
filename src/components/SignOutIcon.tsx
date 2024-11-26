"use client";

import { useClerk } from "@clerk/nextjs";
import { RiLogoutBoxRLine } from "react-icons/ri";

export default function SignOutIcon() {
  const { signOut } = useClerk();
  return <RiLogoutBoxRLine className="cursor-pointer" size="1.75rem" onClick={() => signOut({ redirectUrl: "/" })} />;
}
