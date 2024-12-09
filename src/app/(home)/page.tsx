import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

const SampleMap = dynamic(() => import("@/components/home/SampleMap"), {
  ssr: false,
});

export default async function HomePage() {
  let user = null;
  try {
    user = await currentUser();
  } catch (e) {
    // Log
  }
  if (user) redirect("/main");
  return (
    <div className="flex flex-col max-w-[100dvw] lg:max-w-6xl px-4 lg:px-0 lg:pt-8 gap-6 text-center">
      <div className="py-2 text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Visualize your mind
      </div>
      <div>
        <p className="mb-2 lg:m-0">
          <strong>Minder</strong> is a simple, easy-to-use mind map app meant to help you keep track of fleeting thoughts.
        </p>
        <p>Organize what&apos;s in your head into visually connected thought bubbles.</p>
      </div>
      <SampleMap />
    </div>
  );
}
