import Link from "next/link";
import { extractDate, extractTime } from "@/utils/time";

type MapCardProps = {
  mapId: string;
  imgUrl: string;
  mapName: string;
  created: string;
};

export default function MapCard({ mapId, imgUrl, mapName, created }: MapCardProps) {
  return (
    <div>
      <Link href={`/maps/c/${mapId}`}>
        <img src={imgUrl} width={235} height={120} alt={mapName} className="rounded-lg" />
      </Link>
      <p className="mt-2 font-bold truncate">{mapName}</p>
      <p className="text-sm opacity-60">
        Created: {extractDate(created)} {extractTime(created)}
      </p>
    </div>
  );
}
