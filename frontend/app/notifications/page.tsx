"use client";

import { Suspense } from "react";
import { Header } from "@/components/layouts/header";
import { NotificationPageContainer } from "./components/NotificationPageContainer";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<div>Chargement des notifications...</div>}>
        <NotificationPageContainer />
      </Suspense>
    </div>
  );
}
