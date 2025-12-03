"use client";

import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileActionsProps } from "../types";

export function ProfileActions({ saving, onCancel }: ProfileActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        type="submit"
        disabled={saving}
        variant="gradient"
        size="lg"
        className="flex-1"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </>
        )}
      </Button>
      <Button type="button" onClick={onCancel} variant="outline" size="lg">
        Annuler
      </Button>
    </div>
  );
}
