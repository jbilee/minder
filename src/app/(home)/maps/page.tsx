import Link from "next/link";
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
      {data?.length ? (
        <div className="grid lg:w-[56rem] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-y-8">
          {data.map(({ id, name, created_at, updated_at, thumbnail }) => (
            <MapCard key={id} mapId={id} mapName={name} imgUrl={thumbnail} lastEdited={updated_at ?? created_at} />
          ))}
        </div>
      ) : (
        <div className="lg:w-[56rem] p-4 text-center">You dont&apos;t have any maps yet.</div>
      )}
      <div className="flex mt-10 mb-20 justify-center">
        <Link href="/maps/new">
          <div className="w-fit px-4 py-2 rounded-xl bg-sky-700 text-slate-50">+ Add map</div>
        </Link>
      </div>
    </div>
  );
}
