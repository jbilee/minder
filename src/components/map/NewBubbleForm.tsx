"use client";

import { type FormEvent, useState } from "react";

type NewBubbleFormProps = {
  createBubble: (text: string) => void;
};

export default function NewBubbleForm({ createBubble }: NewBubbleFormProps) {
  const [input, setInput] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") return;
    createBubble(input);
    setInput("");
  };
  return (
    <div className="fixed bottom-2">
      <form onSubmit={onSubmit}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <input type="submit" value="Add" />
      </form>
    </div>
  );
}
