import { User } from "@/lib/types";

export type CandidateProfileFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  experience_years: number;
  education_level: string;
  desired_position: string;
  desired_salary_min: string;
  desired_salary_max: string;
  location: string;
  skills: string;
  languages: string;
  availability: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
};

export interface FormSectionProps {
  formData: CandidateProfileFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export interface ProfileActionsProps {
  saving: boolean;
  onCancel: () => void;
}

export interface CandidateProfileFormProps {
  initialData: CandidateProfileFormData;
  user: User | null;
}
