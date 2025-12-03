"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import apiClient from "@/lib/api/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { CandidateProfileHeader } from "./CandidateProfileHeader";
import { PersonalInformationSection } from "./PersonalInformationSection";
import { ProfessionalInformationSection } from "./ProfessionalInformationSection";
import { SalaryExpectationsSection } from "./SalaryExpectationsSection";
import { SkillsLanguagesSection } from "./SkillsLanguagesSection";
import { SocialLinksSection } from "./SocialLinksSection";
import { ProfileActions } from "./ProfileActions";
import { CandidateProfileFormData } from "../types";

export function CandidateProfileForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CandidateProfileFormData>({
    first_name: "",
    last_name: "",
    phone: "",
    bio: "",
    experience_years: 0,
    education_level: "",
    desired_position: "",
    desired_salary_min: "",
    desired_salary_max: "",
    location: "",
    skills: "",
    languages: "",
    availability: "IMMEDIATE",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "CANDIDATE") {
      router.push("/auth/login");
      return;
    }
    loadProfile();
  }, [isAuthenticated, user, router]);

  const loadProfile = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      if (userData.candidate_profile) {
        const profile = userData.candidate_profile;
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone: userData.phone || "",
          bio: profile.bio || "",
          experience_years: profile.experience_years || 0,
          education_level: profile.education_level || "",
          desired_position: profile.desired_position || "",
          desired_salary_min: profile.desired_salary_min || "",
          desired_salary_max: profile.desired_salary_max || "",
          location: profile.location || "",
          skills: profile.skills?.join(", ") || "",
          languages: profile.languages?.join(", ") || "",
          availability: profile.availability || "IMMEDIATE",
          linkedin_url: profile.linkedin_url || "",
          github_url: profile.github_url || "",
          portfolio_url: profile.portfolio_url || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        candidate_profile: {
          bio: formData.bio,
          experience_years: parseInt(formData.experience_years.toString()),
          education_level: formData.education_level,
          desired_position: formData.desired_position,
          desired_salary_min: formData.desired_salary_min
            ? parseFloat(formData.desired_salary_min)
            : null,
          desired_salary_max: formData.desired_salary_max
            ? parseFloat(formData.desired_salary_max)
            : null,
          location: formData.location,
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          languages: formData.languages
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean),
          availability: formData.availability,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          portfolio_url: formData.portfolio_url,
        },
      };

      await apiClient.updateProfile(updateData);
      toast.success("Profil mis à jour avec succès !");
      setTimeout(() => router.push("/dashboard/candidate"), 1500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <CandidateProfileHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInformationSection
          formData={formData}
          handleChange={handleChange}
        />
        <ProfessionalInformationSection
          formData={formData}
          handleChange={handleChange}
        />
        <SalaryExpectationsSection
          formData={formData}
          handleChange={handleChange}
        />
        <SkillsLanguagesSection
          formData={formData}
          handleChange={handleChange}
        />
        <SocialLinksSection formData={formData} handleChange={handleChange} />

        <ProfileActions saving={saving} onCancel={() => router.push("/dashboard/candidate")} />
      </form>
    </motion.div>
  );
}
