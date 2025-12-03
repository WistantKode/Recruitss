"use client";

import { User, Phone, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function PersonalInformationSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          Informations Personnelles
        </CardTitle>
        <CardDescription>Vos coordonnées et informations de contact</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prénom *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="Jean"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="Dupont"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Localisation</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
