import RecentBubbles from "@/components/home/RecentBubbles";

export default function MainPage() {
  return (
    <div className="flex flex-col max-w-[100dvw] lg:max-w-4xl min-h-[calc(100dvh-97px)] sm:min-h-0 px-4 lg:px-0 gap-6">
      <div>
        <h1 className="mb-2 text-lg font-bold">Recent thoughts</h1>
        <RecentBubbles />
      </div>
    </div>
  );
}
