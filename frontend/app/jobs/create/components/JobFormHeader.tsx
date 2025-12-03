"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function JobFormHeader() {
  const router = useRouter();
  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/recruiter")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour au dashboard
      </Button>

      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Publier une nouvelle offre
      </h1>
      <p className="text-muted-foreground">
        Créez une offre d&#39;emploi attractive pour attirer les meilleurs talents
      </p>
    </div>
  );
}
