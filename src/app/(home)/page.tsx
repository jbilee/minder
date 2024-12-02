import { redirect } from "next/navigation";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  let user = null;
  try {
    user = await currentUser();
  } catch (e) {
    // Log
  }
  if (user) redirect("/main");
  return (
    <div className="flex flex-col max-w-[100dvw] lg:max-w-6xl px-4 lg:px-0 lg:pt-14 gap-6">
      <div className="py-2 text-4xl text-center lg:text-left lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Visualize your mind
      </div>
      <p className="text-center">
        Minder is a simple, easy-to-use mind map app meant to help you keep track of fleeting thoughts.
      </p>
      <p className="text-center">Organize what&apos;s in your head into connected thought bubbles.</p>
      <Image
        src="https://utfs.io/f/5Jr9cM2jiS1IDB9vq4fbLaNeviYoIrHfXEWTGMn9jdmFZ3q1"
        width={527}
        height={333}
        alt="Mind map sample"
        className="lg:hidden self-center"
      />
      <Image
        src="https://utfs.io/f/5Jr9cM2jiS1IljLCzYkoFgcmbpRfW8wt20e4k9diDyxASa6M"
        width={702}
        height={374}
        alt="Mind map sample"
        className="hidden lg:block self-center"
      />
    </div>
  );
}
