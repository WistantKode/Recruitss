"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileActionsProps } from "../types";

export function RecruiterProfileActions({ saving, onCancel }: ProfileActionsProps) {
  return (
    <div className="flex gap-4 pt-6">
      <Button
        type="submit"
        disabled={saving}
        variant="gradient"
        className="flex-1"
      >
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
}
