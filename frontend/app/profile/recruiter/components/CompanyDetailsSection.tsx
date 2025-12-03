"use client";

import { Users, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function CompanyDetailsSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle>Détails de l'Entreprise</CardTitle>
            <CardDescription>Taille et secteur d'activité</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Taille de l'entreprise</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                className="w-full h-10 pl-10 pr-4 border border-input rounded-md focus:ring-2 focus:ring-ring bg-background"
              >
                <option value="">Sélectionner...</option>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="201-500">201-500 employés</option>
                <option value="501-1000">501-1000 employés</option>
                <option value="1000+">1000+ employés</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Secteur d'activité</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full h-10 pl-10 pr-4 border border-input rounded-md focus:ring-2 focus:ring-ring bg-background"
              >
                <option value="">Sélectionner...</option>
                <option value="TECH">Technologies</option>
                <option value="FINANCE">Finance</option>
                <option value="HEALTHCARE">Santé</option>
                <option value="EDUCATION">Éducation</option>
                <option value="RETAIL">Commerce</option>
                <option value="MANUFACTURING">Industrie</option>
                <option value="SERVICES">Services</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
