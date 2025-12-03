"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';

import { JobFormHeader } from './JobFormHeader';
import { BasicInfoSection } from './BasicInfoSection';
import { JobDetailsSection } from './JobDetailsSection';
import { SalarySection } from './SalarySection';
import { SkillsBenefitsSection } from './SkillsBenefitsSection';
import { FormActions } from './FormActions';
import { JobFormData } from '../types';

export function CreateJobForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    contract_type: 'CDI',
    location: '',
    remote: false,
    salary_min: '',
    salary_max: '',
    experience_required: 0,
    education_level: '',
    skills: '',
    benefits: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'RECRUITER') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        contract_type: formData.contract_type,
        location: formData.location,
        remote: formData.remote,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        experience_required: parseInt(formData.experience_required.toString()),
        education_level: formData.education_level,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        benefits: formData.benefits,
        status: 'DRAFT',
      };

      const newJob = await apiClient.createJob(jobData);
      toast.success('Offre créée avec succès !', {
        description: 'Vous pouvez maintenant la publier depuis la page de détails'
      });
      setTimeout(() => router.push(`/jobs/${newJob.id}`), 1500);
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.response?.data?.message || 'Erreur lors de la création de l\'offre'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <JobFormHeader />

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoSection formData={formData} handleChange={handleChange} />
          <JobDetailsSection formData={formData} handleChange={handleChange} />
          <SalarySection formData={formData} handleChange={handleChange} />
          <SkillsBenefitsSection formData={formData} handleChange={handleChange} />

          <FormActions loading={loading} onCancel={() => router.push('/dashboard/recruiter')} />
          <p className="text-sm text-muted-foreground text-center">
            L&#39;offre sera créée en brouillon. Vous pourrez la publier depuis la page de détails.
          </p>
        </form>
      </motion.div>
    </main>
  );
}
