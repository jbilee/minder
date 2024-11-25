"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import type { BubbleData, BubbleProps } from "@/components/map/Canvas";

export const postBubble = async (bubble: BubbleData): Promise<BubbleProps | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("bubbles").insert(bubble).select();
  if (error) {
    // TODO: Handle error
    return null;
  }
  return data[0];
};

export const putBubble = async (bubble: BubbleProps) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bubbles").update(bubble).eq("id", bubble.id);
  if (error) {
    // TODO: Log error
    throw new Error("Failed to update bubble.");
  }
};
