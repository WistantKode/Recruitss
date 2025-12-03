"use client";

import { Linkedin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function RecruiterSocialLinksSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
            <Linkedin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <CardTitle>Réseaux Professionnels</CardTitle>
            <CardDescription>Liens vers vos profils sociaux</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-medium">LinkedIn de l'entreprise</label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="pl-10"
              placeholder="https://linkedin.com/company/votre-entreprise"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
