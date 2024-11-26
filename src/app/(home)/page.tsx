import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/main");
  return (
    <div className="flex flex-col max-w-[100dvw] lg:max-w-4xl px-4 lg:px-0 gap-6">
      Welcome!
    </div>
  );
}
