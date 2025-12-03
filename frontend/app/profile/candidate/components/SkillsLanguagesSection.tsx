"use client";

import { FileText, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function SkillsLanguagesSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          Compétences et Langues
        </CardTitle>
        <CardDescription>
          Vos compétences techniques et linguistiques
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Compétences</label>
          <Input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, Python, SQL, Docker..."
          />
          <p className="text-xs text-muted-foreground">
            Séparez les compétences par des virgules
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Langues</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="pl-10"
              placeholder="Français, Anglais, Espagnol..."
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Séparez les langues par des virgules
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
