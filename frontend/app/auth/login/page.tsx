"use client";

import { Suspense } from "react";
import LoginContainer from "./components/LoginContainer";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
      <LoginContainer />
    </Suspense>
  );
}
