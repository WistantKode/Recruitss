'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layouts/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  Building2,
  MoreVertical,
  Ban,
  CheckCircle
} from 'lucide-react';

// Mock data - replace with actual API call
const mockUsers = [
  {
    id: 1,
    email: 'jean.dupont@example.com',
    first_name: 'Jean',
    last_name: 'Dupont',
    role: 'CANDIDATE',
    is_active: true,
    created_at: '2024-01-15',
    phone: '+33 6 12 34 56 78',
  },
  {
    id: 2,
    email: 'marie.martin@techcorp.fr',
    first_name: 'Marie',
    last_name: 'Martin',
    role: 'RECRUITER',
    is_active: true,
    created_at: '2024-01-20',
    phone: '+33 6 98 76 54 32',
  },
  {
    id: 3,
    email: 'pierre.bernard@example.com',
    first_name: 'Pierre',
    last_name: 'Bernard',
    role: 'CANDIDATE',
    is_active: false,
    created_at: '2024-02-01',
    phone: '+33 6 45 67 89 01',
  },
  {
    id: 4,
    email: 'sophie.dubois@innovate.com',
    first_name: 'Sophie',
    last_name: 'Dubois',
    role: 'RECRUITER',
    is_active: true,
    created_at: '2024-02-10',
    phone: '+33 6 23 45 67 89',
  },
  {
    id: 5,
    email: 'admin@recruitsss.com',
    first_name: 'Admin',
    last_name: 'System',
    role: 'ADMIN',
    is_active: true,
    created_at: '2024-01-01',
    phone: '+33 6 00 00 00 00',
  },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(mockUsers);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/auth/login');
      return;
    }
    // Simulate API call
    setTimeout(() => setLoading(false), 500);
  }, [isAuthenticated, user]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, is_active: !u.is_active } : u
    ));
    toast.success('Statut utilisateur mis à jour');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'RECRUITER': return 'default';
      case 'CANDIDATE': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="h-3 w-3" />;
      case 'RECRUITER': return <Building2 className="h-3 w-3" />;
      case 'CANDIDATE': return <UserCheck className="h-3 w-3" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-12 w-80 mb-2" />
          <Skeleton className="h-5 w-96 mb-8" />
          
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérer tous les utilisateurs de la plateforme - {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Role Filter */}
              <div className="flex gap-2">
                <Button
                  variant={roleFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('all')}
                >
                  Tous
                </Button>
                <Button
                  variant={roleFilter === 'CANDIDATE' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('CANDIDATE')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Candidats
                </Button>
                <Button
                  variant={roleFilter === 'RECRUITER' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('RECRUITER')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Recruteurs
                </Button>
                <Button
                  variant={roleFilter === 'ADMIN' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRoleFilter('ADMIN')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admins
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Aucun utilisateur trouvé</p>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos filtres de recherche
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header (hidden on mobile) */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 pb-3 border-b text-sm font-medium text-muted-foreground">
                  <div className="col-span-3">Utilisateur</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Rôle</div>
                  <div className="col-span-2">Inscription</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* User Rows */}
                {filteredUsers.map((u, index) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    {/* User Info */}
                    <div className="md:col-span-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {u.first_name[0]}{u.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{u.first_name} {u.last_name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {u.phone}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-3 flex items-center">
                      <div>
                        <p className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {u.email}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="md:col-span-2 flex items-center">
                      <Badge variant={getRoleBadgeVariant(u.role)} className="gap-1">
                        {getRoleIcon(u.role)}
                        {u.role === 'CANDIDATE' ? 'Candidat' : u.role === 'RECRUITER' ? 'Recruteur' : 'Admin'}
                      </Badge>
                    </div>

                    {/* Created Date */}
                    <div className="md:col-span-2 flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant={u.is_active ? 'outline' : 'default'}
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.is_active ? (
                          <>
                            <Ban className="h-4 w-4 mr-1" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activer
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Candidats</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'CANDIDATE').length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recruteurs</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'RECRUITER').length}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.is_active).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
