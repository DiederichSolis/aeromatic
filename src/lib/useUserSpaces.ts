// src/hooks/useUserSpaces.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export type UserSpace = {
  id: string;
  name: string;
  description?: string | null;
};

export function useUserSpaces() {
  const [spaces, setSpaces] = useState<UserSpace[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setSpaces([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("spaces")
      .select("id, name, description")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("useUserSpaces error", error);
      setSpaces([]);
    } else {
      setSpaces(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return { spaces, loading, refetch: fetchSpaces };
}
