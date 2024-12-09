"use client";

import { useRouter } from "next/navigation";
import { deleteAccount } from "@/app/actions";

export default function DeleteAccountButton({ userId }: { userId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!response) return;
    try {
      await deleteAccount(userId);
      router.push("/");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <button className="px-3 py-1 rounded-md text-white bg-rose-600" onClick={handleDelete}>
      Delete account
    </button>
  );
}
