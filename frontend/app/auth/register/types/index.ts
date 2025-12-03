export type FormData = {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "CANDIDATE" | "RECRUITER";
  bio: string;
  skills: string;
  experience_years: number;
  location: string;
  company_name: string;
  company_description: string;
  industry: string;
};

export interface FormActionsProps {
    step: number;
    loading: boolean;
    onBack: () => void;
}

export interface PasswordStrengthIndicatorProps {
    password: string;
}

export interface ProgressIndicatorProps {
    step: number;
}

export interface Step2CandidateFormProps {
    formData: Partial<FormData>;
    setFormData: (data: Partial<FormData>) => void;
}

export interface Step2RecruiterFormProps {
    formData: Partial<FormData>;
    setFormData: (data: Partial<FormData>) => void;
}