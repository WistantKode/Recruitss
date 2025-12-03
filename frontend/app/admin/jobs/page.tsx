'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layouts/header';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  MapPin,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data - replace with API call
const mockJobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'Tech Solutions Inc',
    location: 'Paris, France',
    type: 'CDI',
    status: 'PUBLISHED',
    applications: 45,
    views: 230,
    salary: '60000-80000',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'Creative Agency',
    location: 'Lyon, France',
    type: 'CDI',
    status: 'DRAFT',
    applications: 0,
    views: 0,
    salary: '45000-55000',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Data Corp',
    location: 'Remote',
    type: 'CDD',
    status: 'PUBLISHED',
    applications: 78,
    views: 450,
    salary: '55000-70000',
    createdAt: '2024-01-10',
  },
  {
    id: 4,
    title: 'Marketing Manager',
    company: 'Brand Studio',
    location: 'Marseille, France',
    type: 'CDI',
    status: 'CLOSED',
    applications: 102,
    views: 890,
    salary: '50000-65000',
    createdAt: '2024-01-05',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    location: 'Toulouse, France',
    type: 'CDI',
    status: 'PUBLISHED',
    applications: 34,
    views: 180,
    salary: '58000-75000',
    createdAt: '2024-01-18',
  },
];

export default function AdminJobsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [isAuthenticated, user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Publié
          </Badge>
        );
      case 'DRAFT':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Brouillon
          </Badge>
        );
      case 'CLOSED':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Fermé
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = (jobId: number, newStatus: string) => {
    // Implement status change logic
    toast.success(`Statut de l'offre mis à jour à ${newStatus}`);
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockJobs.length,
    published: mockJobs.filter(j => j.status === 'PUBLISHED').length,
    draft: mockJobs.filter(j => j.status === 'DRAFT').length,
    closed: mockJobs.filter(j => j.status === 'CLOSED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Emplois
          </h1>
          <p className="text-muted-foreground mt-2">
            Superviser et gérer toutes les offres d'emploi
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Offres</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Publiées</p>
                  <p className="text-3xl font-bold">{stats.published}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Brouillons</p>
                  <p className="text-3xl font-bold">{stats.draft}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fermées</p>
                  <p className="text-3xl font-bold">{stats.closed}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par titre ou entreprise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                  >
                    Toutes
                  </Button>
                  <Button
                    variant={statusFilter === 'PUBLISHED' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('PUBLISHED')}
                    className="gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Publiées
                  </Button>
                  <Button
                    variant={statusFilter === 'DRAFT' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('DRAFT')}
                    className="gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    Brouillons
                  </Button>
                  <Button
                    variant={statusFilter === 'CLOSED' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('CLOSED')}
                    className="gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Fermées
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Aucune offre trouvée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Job Info */}
                            <div className="col-span-12 md:col-span-4">
                              <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                {job.company}
                              </div>
                            </div>

                            {/* Location & Type */}
                            <div className="col-span-6 md:col-span-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <Badge variant="outline">{job.type}</Badge>
                            </div>

                            {/* Stats */}
                            <div className="col-span-6 md:col-span-2">
                              <div className="text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                  <Briefcase className="h-4 w-4" />
                                  {job.applications} candidatures
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Eye className="h-4 w-4" />
                                  {job.views} vues
                                </div>
                              </div>
                            </div>

                            {/* Salary & Date */}
                            <div className="col-span-6 md:col-span-2">
                              <div className="text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary}€
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-2">
                              {getStatusBadge(job.status)}
                              {job.status === 'DRAFT' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(job.id, 'PUBLISHED')}
                                  className="gap-1"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Publier
                                </Button>
                              )}
                              {job.status === 'PUBLISHED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(job.id, 'CLOSED')}
                                  className="gap-1"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Fermer
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
