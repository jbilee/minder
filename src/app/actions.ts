"use server";

import { clerkClient } from "@clerk/nextjs/server";
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

export const putBubbleItem = async (bubble: BubbleProps) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bubbles").update(bubble).eq("id", bubble.id);
  if (error) {
    // TODO: Log error
    throw new Error("Failed to update bubble.");
  }
};

export const putBubbleArray = async (bubbles: BubbleProps[]) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bubbles").upsert(bubbles);
  if (error) {
    // TODO: Log error
    throw new Error("Failed to update bubbles.");
  }
};

export const deleteBubble = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("bubbles").delete().eq("id", id);
  if (error) {
    // TODO: Log error
    throw new Error("Failed to delete bubble.");
  }
};

export const postMap = async (name: string): Promise<string | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("maps").insert({ name }).select("id");
  if (error) {
    // TODO: Handle error
    return null;
  }
  return data[0].id;
};

export const deleteAccount = async (userId: string) => {
  if (userId === "user_2pxZvebk7uZHwtbKARl2tjVWUQ2") {
    throw new Error("Demo accounts can't be deleted.");
  }
  const clerk = await clerkClient();
  await clerk.users.deleteUser(userId);
};
