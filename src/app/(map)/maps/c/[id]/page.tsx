import dynamic from "next/dynamic";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const Canvas = dynamic(() => import("@/components/map/Canvas"), {
  ssr: false,
});

export default async function MapView({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("bubbles").select().eq("map_id", params.id);
  if (error) {
    // TODO: Handle error
  }
  return (
    <div className="flex flex-col min-h-dvh justify-center items-center">
      <Canvas data={data ?? []} mapId={params.id} />
      {/* <ControlPanel /> */}
    </div>
  );
}
