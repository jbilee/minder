"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { postMap } from "@/app/actions";

export default function NewMapForm() {
  const [input, setInput] = useState("");
  const [mapId, setMapId] = useState<null | string>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length > 30) return;
    setInput(input);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await postMap(input || "Untitled");
    if (result) {
      setMapId(result);
    }
    setInput("");
  };

  if (mapId)
    return (
      <div className="text-center">
        <p className="mb-4">Created a new map!</p>
        <Link href={`/maps/c/${mapId}`} className="px-4 py-2 rounded-xl bg-sky-700 text-slate-50">
          Go to map
        </Link>
      </div>
    );
  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex gap-4">
        Name
        <div className="w-full border-b border-slate-700 dark:border-slate-50">
          <input className="w-full bg-transparent" type="text" value={input} onChange={handleInput} />
        </div>
      </div>
      <input
        className="w-fit px-4 py-2 self-center rounded-xl bg-sky-700 text-slate-50 cursor-pointer"
        type="submit"
        value="Create map"
      />
    </form>
  );
}
