import { JobOffer } from "@/lib/types";

export type JobFilters = {
  search: string;
  location: string;
  contract_type: string;
  is_remote: string;
};

export interface JobSearchSectionProps {
  initialFilters: JobFilters; // Pour initialiser les filtres locaux
  onSearchSubmit: (filters: JobFilters) => void; // Appelé lors de la soumission du formulaire
  jobsCount: number;
}

export interface JobCardProps {
  job: JobOffer;
  index: number;
}

export interface JobListSectionProps {
  jobs: JobOffer[];
  loading: boolean;
}
