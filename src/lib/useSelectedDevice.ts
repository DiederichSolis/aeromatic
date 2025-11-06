// src/hooks/useSelectedDevice.ts
"use client";

import { useEffect, useState } from "react";
import { UserDevice } from "./useUserDevices";

export function useSelectedDevice(devices: UserDevice[]) {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (devices.length > 0 && !selectedId) {
      setSelectedId(devices[0].device_id);
    }
  }, [devices, selectedId]);

  return { selectedId, setSelectedId };
}
