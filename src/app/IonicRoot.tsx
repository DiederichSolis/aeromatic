"use client";

import { IonApp } from "@ionic/react";
import type { PropsWithChildren } from "react";

export default function IonicRoot({ children }: PropsWithChildren) {
  return <IonApp>{children}</IonApp>;
}
