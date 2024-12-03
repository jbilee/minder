import Link from "next/link";
import { extractDate, extractTime } from "@/utils/time";

type MapCardProps = {
  mapId: string;
  imgUrl: string;
  mapName: string;
  lastEdited: string;
};

export default function MapCard({ mapId, imgUrl, mapName, lastEdited }: MapCardProps) {
  return (
    <div>
      <Link href={`/maps/c/${mapId}`}>
        <img src={imgUrl} width={235} height={120} alt={mapName} className="rounded-lg" />
      </Link>
      <p className="mt-2 font-bold truncate">{mapName}</p>
      <p className="text-sm">
        Updated: {extractDate(lastEdited)} {extractTime(lastEdited)}
      </p>
    </div>
  );
}
