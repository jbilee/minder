import Image from "next/image";
import Link from "next/link";

type MapCardProps = {
  mapId: string;
  imgUrl: string;
  mapName: string;
};

export default function MapCard({ mapId, imgUrl, mapName }: MapCardProps) {
  return (
    <Link href={`/maps/${mapId}`}>
      <div className="rounded-xl grid place-content-center p-4 border border-blue-400">
        <Image src={imgUrl} width={150} height={150} alt={mapName} />
        {mapName}
      </div>
    </Link>
  );
}
