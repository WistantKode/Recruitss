"use client";

import { FileText, MapPin, Calendar, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function JobDetailsSection({ formData, handleChange }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle>Détails du poste</CardTitle>
            <CardDescription>Type de contrat et localisation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Type de contrat *
              </div>
            </label>
            <select
              name="contract_type"
              value={formData.contract_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="FREELANCE">Freelance</option>
              <option value="INTERNSHIP">Stage</option>
              <option value="APPRENTICESHIP">Alternance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Localisation *
              </div>
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Paris, France"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Expérience requise (années)
              </div>
            </label>
            <Input
              type="number"
              name="experience_required"
              value={formData.experience_required}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Niveau d&#39;études
              </div>
            </label>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="">Non spécifié</option>
              <option value="BAC">Baccalauréat</option>
              <option value="BAC+2">Bac +2</option>
              <option value="BAC+3">Bac +3 (Licence)</option>
              <option value="BAC+5">Bac +5 (Master)</option>
              <option value="BAC+8">Bac +8 (Doctorat)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
                className="w-4 h-4 rounded border-input"
              />
              <span className="text-sm font-medium">Télétravail possible</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
