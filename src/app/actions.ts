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
