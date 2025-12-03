"use client";

import { Briefcase, Calendar, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function ProfessionalInformationSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Briefcase className="h-5 w-5 text-purple-600" />
          </div>
          Informations Professionnelles
        </CardTitle>
        <CardDescription>Votre parcours et objectifs professionnels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio / Présentation</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Présentez-vous en quelques lignes... Votre parcours, vos ambitions, ce qui vous passionne..."
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Années d'expérience</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                min="0"
                className="pl-10"
                placeholder="3"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Niveau d'études</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
              <select
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="">Sélectionner...</option>
                <option value="BAC">Baccalauréat</option>
                <option value="BAC+2">Bac +2</option>
                <option value="BAC+3">Bac +3 (Licence)</option>
                <option value="BAC+5">Bac +5 (Master)</option>
                <option value="BAC+8">Bac +8 (Doctorat)</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Poste recherché</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="desired_position"
                value={formData.desired_position}
                onChange={handleChange}
                className="pl-10"
                placeholder="Développeur Full Stack"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Disponibilité</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="IMMEDIATE">Immédiate</option>
              <option value="ONE_MONTH">Dans 1 mois</option>
              <option value="THREE_MONTHS">Dans 3 mois</option>
              <option value="SIX_MONTHS">Dans 6 mois</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
