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
    <div className="p-2 rounded-md border bg-white dark:bg-slate-800 border-neutral-300 dark:border-slate-600">
      <p className="mb-2 truncate">{text}</p>
      <p className="text-right text-sm text-slate-700 dark:text-slate-400">
        {extractDate(createdAt)} {extractTime(createdAt)}
      </p>
      <p className="text-right text-sm truncate text-slate-700 dark:text-slate-400">
        in{" "}
        <Link href={`/maps/c/${mapId}`}>
          <strong>{mapName}</strong>
        </Link>
      </p>
    </div>
  );
}
