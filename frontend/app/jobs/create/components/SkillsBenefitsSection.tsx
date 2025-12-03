"use client";

import { Briefcase, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function SkillsBenefitsSection({ formData, handleChange }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle>Compétences et Avantages</CardTitle>
            <CardDescription>Skills requises et bénéfices offerts</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Compétences requises
            </div>
          </label>
          <Input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL, Docker"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Séparez les compétences par des virgules
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              Avantages
            </div>
          </label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            rows={3}
            placeholder="RTT, tickets restaurant, mutuelle, télétravail..."
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
