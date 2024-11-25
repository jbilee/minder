import Link from "next/link";
import { extractDate, extractTime } from "@/utils/time";

type BubblePreviewProps = {
  text: string;
  createdAt: string;
  mapId: string;
  mapName: string;
};

export default function BubblePreview({ text, createdAt, mapId, mapName }: BubblePreviewProps) {
  return (
    <Link href={`/maps/c/${mapId}`}>
      <div className="flex flex-col w-52 p-2 rounded-md border bg-white dark:bg-slate-800 border-neutral-300 dark:border-slate-600">
        <span className="mb-2 truncate">{text}</span>
        <span className="text-sm text-slate-700 dark:text-slate-400">
          {extractDate(createdAt)} {extractTime(createdAt)}
        </span>
        <span className="text-sm truncate text-slate-700 dark:text-slate-400">
          in <strong>{mapName}</strong>
        </span>
      </div>
    </Link>
  );
}
