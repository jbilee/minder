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
    <form onSubmit={onSubmit} className="fixed bottom-4 flex gap-2 px-4 py-2 rounded-2xl bg-slate-400">
      <input type="text" value={input} onChange={handleInput} />
      <input type="submit" value="Add" />
    </form>
  );
}
