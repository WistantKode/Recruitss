"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormActionsProps } from "../types";

export function FormActions({ loading, onCancel }: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="submit"
        disabled={loading}
        variant="gradient"
        size="lg"
        className="flex-1"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Création...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Créer l&#39;offre (brouillon)
          </>
        )}
      </Button>
      <Button type="button" variant="outline" size="lg" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
}
