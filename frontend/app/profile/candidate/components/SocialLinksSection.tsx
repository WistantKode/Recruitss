"use client";

import { Link as LinkIcon, Linkedin, Github, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function SocialLinksSection({ formData, handleChange }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <LinkIcon className="h-5 w-5 text-pink-600" />
          </div>
          Liens Professionnels
        </CardTitle>
        <CardDescription>
          Vos profils sur les réseaux professionnels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">LinkedIn</label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="pl-10"
              placeholder="https://linkedin.com/in/votre-profil"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub</label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="pl-10"
              placeholder="https://github.com/votre-username"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Portfolio</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              className="pl-10"
              placeholder="https://votre-portfolio.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
