'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { RecruiterProfileHeader } from './RecruiterProfileHeader';
import { RecruiterPersonalInformationSection } from './RecruiterPersonalInformationSection';
import { CompanyInformationSection } from './CompanyInformationSection';
import { CompanyDetailsSection } from './CompanyDetailsSection';
import { RecruiterSocialLinksSection } from './RecruiterSocialLinksSection';
import { RecruiterProfileActions } from './RecruiterProfileActions';
import { RecruiterProfileFormData } from '../types';

export function RecruiterProfileForm() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<RecruiterProfileFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    company_description: '',
    company_website: '',
    company_size: '',
    industry: '',
    location: '',
    linkedin_url: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'RECRUITER') {
      router.push('/auth/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, user, router]);

  const loadProfile = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      if (userData.recruiter_profile) {
        const profile = userData.recruiter_profile;
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          company_name: profile.company_name || '',
          company_description: profile.company_description || '',
          company_website: profile.company_website || '',
          company_size: profile.company_size || '',
          industry: profile.industry || '',
          location: profile.location || '',
          linkedin_url: profile.linkedin_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Erreur lors du chargement du profil');
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
        recruiter_profile: {
          company_name: formData.company_name,
          company_description: formData.company_description,
          company_website: formData.company_website,
          company_size: formData.company_size,
          industry: formData.industry,
          location: formData.location,
          linkedin_url: formData.linkedin_url,
        }
      };

      await apiClient.updateProfile(updateData);
      toast.success('Profil mis à jour avec succès !');
      setTimeout(() => router.push('/dashboard/recruiter'), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-12 w-80 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <RecruiterProfileHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <RecruiterPersonalInformationSection formData={formData} handleChange={handleChange} />
        <CompanyInformationSection formData={formData} handleChange={handleChange} />
        <CompanyDetailsSection formData={formData} handleChange={handleChange} />
        <RecruiterSocialLinksSection formData={formData} handleChange={handleChange} />

        <RecruiterProfileActions saving={saving} onCancel={() => router.push('/dashboard/recruiter')} />
      </form>
    </motion.div>
  );
}
