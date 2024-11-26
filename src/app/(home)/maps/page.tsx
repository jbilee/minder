import MapCard from "@/components/map/MapCard";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function MapsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("maps").select("id, name, created_at, updated_at, thumbnail");
  if (error) {
    // TODO: Handle exception
  }
  return (
    <div className="lg:max-w-4xl px-4 lg:px-0">
      <h1 className="mb-2 text-lg font-bold">All maps</h1>
      <div className="grid lg:w-[56rem] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-4 sm:gap-0">
        {data?.length ? (
          data.map(({ id, name, created_at, updated_at, thumbnail }) => (
            <MapCard key={id} mapId={id} mapName={name} imgUrl={thumbnail} lastEdited={updated_at ?? created_at} />
          ))
        ) : (
          <div className="lg:w-[56rem] p-4 text-center">There aren&apos;t any maps yet.</div>
        )}
      </div>
    </div>
  );
}
