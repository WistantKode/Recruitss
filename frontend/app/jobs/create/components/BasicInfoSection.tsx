"use client";

import { Briefcase, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function BasicInfoSection({ formData, handleChange }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>Les informations principales du poste</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Titre du poste *
            </div>
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="ex: Développeur Full Stack Senior"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description du poste *
            </div>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Décrivez le poste, le contexte, l'équipe..."
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              Responsabilités *
            </div>
          </label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Liste des responsabilités principales..."
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Prérequis *
            </div>
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Compétences et qualifications requises..."
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
