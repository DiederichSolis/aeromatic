// src/hooks/useSelectedSpace.ts
"use client";

import { useEffect, useState } from "react";
import { UserSpace } from "./useUserSpaces";

export function useSelectedSpace(spaces: UserSpace[]) {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (spaces.length > 0 && !selectedSpaceId) {
      setSelectedSpaceId(spaces[0].id);
    }
  }, [spaces, selectedSpaceId]);

  return { selectedSpaceId, setSelectedSpaceId };
}
