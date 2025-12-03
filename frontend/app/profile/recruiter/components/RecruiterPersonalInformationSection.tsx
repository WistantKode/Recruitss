"use client";

import { User, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function RecruiterPersonalInformationSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Vos coordonnées de contact</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prénom *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="John"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
      </CardContent>
    </Card>
  );
}
