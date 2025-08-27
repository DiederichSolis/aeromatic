"use client";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";

export default function HomePage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>APP Aeromatic</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Hola 👋</h1>
        <p className="mb-4">Next.js + Ionic + Tailwind funcionando.</p>
        <IonButton expand="block">Botón Ionic</IonButton>
      </IonContent>
    </IonPage>
  );
}
