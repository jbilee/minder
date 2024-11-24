import MapCard from "@/components/map/MapCard";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function Maps() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("maps").select("id, name, created_at, updated_at, thumbnail");
  if (error) {
    // TODO: Handle exception
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {data?.length &&
        data.map(({ id, name, created_at, updated_at, thumbnail }) => (
          <MapCard key={id} mapId={id} mapName={name} imgUrl={thumbnail} lastEdited={updated_at ?? created_at} />
        ))}
    </main>
  );
}
