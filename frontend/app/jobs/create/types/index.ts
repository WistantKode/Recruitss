import React from "react";


export type JobFormData = {
    title: string;
    description: string;
    requirements: string;
    responsibilities: string;
    contract_type: string;
    location: string;
    remote: boolean;
    salary_min: string;
    salary_max: string;
    experience_required: number;
    education_level: string;
    skills: string;
    benefits: string;
};

export interface FormSectionProps {
    formData: JobFormData;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
}

export interface FormActionsProps {
    loading: boolean;
    onCancel: () => void;
}
