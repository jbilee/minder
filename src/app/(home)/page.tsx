import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  let user = null;
  try {
    user = await currentUser();
  } catch (e) {
    // Log
  }
  if (user) redirect("/main");
  return <div className="flex flex-col max-w-[100dvw] lg:max-w-4xl px-4 lg:px-0 gap-6">Welcome!</div>;
}
