import BubblePreview from "@/components/home/BubblePreview";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const getFirstObjectKey = (obj: any, key: string) => {
  if (Array.isArray(obj)) {
    const [firstItem] = obj;
    return firstItem[key];
  }
  return obj[key];
};

export default async function RecentBubbles() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bubbles")
    .select("created_at, text, maps(id, name)")
    .limit(5)
    .order("created_at", { ascending: false });
  if (error) {
    // TODO: Handle error
  }
  return (
    <div className="grid grid-rows-5 grid-cols-1 lg:grid-rows-3 lg:grid-cols-2 gap-2">
      {data?.length &&
        data.map((bubble) => (
          <BubblePreview
            key={bubble.created_at}
            text={bubble.text}
            createdAt={bubble.created_at}
            mapId={getFirstObjectKey(bubble.maps, "id")}
            mapName={getFirstObjectKey(bubble.maps, "name")}
          />
        ))}
    </div>
  );
}
