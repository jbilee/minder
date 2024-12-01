import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { getDateFromMS } from "@/utils/time";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/signin");
  return (
    <div className="lg:w-96 px-4 lg:px-0">
      <h1 className="mb-2 text-lg font-bold">My account</h1>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
      <p>Joined: {getDateFromMS(user.createdAt)}</p>
      <p className="mt-10 text-right">
        <DeleteAccountButton userId={user.id} />
      </p>
    </div>
  );
}
