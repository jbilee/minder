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
    <Link href={`/maps/c/${mapId}`}>
      <div className="rounded-xl grid place-content-center p-4 border border-blue-400">
        <Image src={imgUrl} width={150} height={150} alt={mapName} />
        {mapName}
        <br />
        {extractDate(lastEdited)} {extractTime(lastEdited)}
      </div>
    </Link>
  );
}
