import Image from "next/image";
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
      {/* <Image src={imgUrl} width={250} height={50} alt={mapName} /> */}
      <Link href={`/maps/c/${mapId}`}>
        <div className="w-[235px] h-[120px] rounded-lg bg-green-500" />
      </Link>
      <p className="mt-2 font-bold truncate">{mapName}</p>
      <p className="text-sm">
        Updated: {extractDate(lastEdited)} {extractTime(lastEdited)}
      </p>
    </div>
  );
}
