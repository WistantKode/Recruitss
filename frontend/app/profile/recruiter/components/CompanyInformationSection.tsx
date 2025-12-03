"use client";

import { Building2, Globe, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function CompanyInformationSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle>Informations de l'Entreprise</CardTitle>
            <CardDescription>Détails de votre société</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de l'entreprise *</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="pl-10"
              placeholder="Acme Corp"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description de l'entreprise</label>
          <textarea
            name="company_description"
            value={formData.company_description}
            onChange={handleChange}
            rows={4}
            placeholder="Décrivez votre entreprise, sa mission, sa culture..."
            className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring bg-background"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site web</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                className="pl-10"
                placeholder="https://www.entreprise.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Localisation</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="pl-10"
                placeholder="Paris, France"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
