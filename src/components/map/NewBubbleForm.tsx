"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

type NewBubbleFormProps = {
  createBubble: (text: string) => void;
};

export default function NewBubbleForm({ createBubble }: NewBubbleFormProps) {
  const [input, setInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length > 130) return;
    setInput(input);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input === "") return;
    createBubble(input);
    setInput("");
  };

  return (
    <form className="fixed bottom-4 flex px-4 py-2 gap-2 rounded-xl bg-sky-700" onSubmit={onSubmit}>
      <input
        className="bg-transparent border-b border-b-slate-50 text-slate-50"
        type="text"
        value={input}
        onChange={handleInput}
      />
      <input className="text-slate-50 cursor-pointer" type="submit" value="Add" />
    </form>
  );
}
