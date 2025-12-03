"use client";

import { Suspense } from "react";
import { Header } from "@/components/layouts/header";
import { CandidateProfileForm } from "./components/CandidateProfileForm";

export default function CandidateProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div>Chargement du profil candidat...</div>}>
        <CandidateProfileForm />
      </Suspense>
    </div>
  );
}
