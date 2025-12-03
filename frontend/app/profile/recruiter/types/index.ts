import { User } from "@/lib/types";

export type RecruiterProfileFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
  company_description: string;
  company_website: string;
  company_size: string;
  industry: string;
  location: string;
  linkedin_url: string;
};

export interface FormSectionProps {
  formData: RecruiterProfileFormData;
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

export interface RecruiterProfileFormProps {
  initialData: RecruiterProfileFormData;
  user: User | null;
}
