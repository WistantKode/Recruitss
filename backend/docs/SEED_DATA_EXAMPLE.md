# Exemple d'Utilisation - seed_data

## Commande Exécutée

```bash
python manage.py seed_data --clear --candidates 20 --recruiters 10 --jobs 30
```

## Sortie Attendue

```
Clearing existing data...
✓ Data cleared
Starting data seeding...
✓ Created admin: admin@recruitsss.com
✓ Created 20 candidates
✓ Created 10 recruiters
✓ Created 30 job offers
✓ Created 87 applications
✓ Created 53 saved jobs
✓ Created 18 payments
✓ Created 234 notifications

🎉 Database seeded successfully!

Admin credentials:
  Email: admin@recruitsss.com
  Password: Admin123!

Sample candidate credentials:
  Email: candidate1@example.com
  Password: Password123!

Sample recruiter credentials:
  Email: recruiter1@example.com
  Password: Password123!
```

## Données Créées - Détails

### 👨‍💼 Administrateur (1)
- Compte avec tous les privilèges
- Accès au panel d'administration Django
- Permissions complètes

### 👤 Candidats (20)
Chaque candidat a :
- ✅ Profil complet avec bio
- ✅ 3-8 compétences techniques
- ✅ 0-15 ans d'expérience
- ✅ Niveau d'éducation (Licence, Master, Ingénieur, etc.)
- ✅ CV (URL simulée)
- ✅ Photo de profil
- ✅ Salaire souhaité (300k-2M XOF)
- ✅ Localisation (Dakar, Abidjan, Paris, etc.)
- ✅ Liens professionnels (LinkedIn, GitHub, Portfolio)
- ✅ Score de complétude du profil calculé

**Exemples de compétences** :
- Python, JavaScript, Java, React, Django, Node.js
- SQL, MongoDB, Docker, Kubernetes, AWS, Azure
- Machine Learning, Data Analysis, UI/UX Design

**Localisations variées** :
- Dakar, Sénégal
- Abidjan, Côte d'Ivoire
- Lomé, Togo
- Cotonou, Bénin
- Paris, France
- Bamako, Mali

### 🏢 Recruteurs (10)
Chaque recruteur a :
- ✅ Nom d'entreprise unique
- ✅ Description de l'entreprise
- ✅ Logo d'entreprise (URL)
- ✅ Site web
- ✅ Taille d'entreprise (1-10 à 1000+ employés)
- ✅ Secteur d'activité
- ✅ Localisation
- ✅ Statut d'abonnement (70% actifs, 30% en attente/expiré)
- ✅ Date de validité d'abonnement (pour les actifs)

**Secteurs variés** :
- Technology, Finance, Healthcare, Education
- Retail, Manufacturing, Consulting, Marketing
- Telecommunications, E-commerce, Logistics

### 💼 Offres d'Emploi (30)

**Titres de postes variés** :
- Développeur Full Stack
- Développeur Backend Python
- Développeur Frontend React
- Data Scientist
- Chef de Projet IT
- DevOps Engineer
- UI/UX Designer
- Analyste de Données
- Ingénieur Machine Learning
- Et plus encore...

**Détails de chaque offre** :
- ✅ Description complète (800 caractères)
- ✅ Exigences et responsabilités
- ✅ Salaire min/max en XOF
- ✅ Type de contrat (CDI, CDD, Freelance, Stage)
- ✅ Localisation ou Remote
- ✅ Compétences requises (3-8 compétences)
- ✅ Niveau d'expérience (Junior, Intermédiaire, Senior, Expert)
- ✅ Éducation requise
- ✅ Statut (70% Publié, 20% Brouillon, 10% Fermé)
- ✅ Nombre de vues (0-500 pour les publiées)
- ✅ Dates de publication et expiration

### 📝 Candidatures (~87)

**Répartition** :
- Chaque candidat postule à 2-5 offres d'emploi
- Lettres de motivation (70% des candidatures)

**Statuts variés** :
- ✅ SUBMITTED (Soumise) - 40%
- ✅ VIEWED (Vue par recruteur) - 30%
- ✅ SHORTLISTED (Présélectionnée) - 15%
- ✅ INTERVIEW_SCHEDULED (Entretien planifié) - 5%
- ✅ REJECTED (Rejetée) - 15%
- ✅ ACCEPTED (Acceptée) - 5%

**Informations complémentaires** :
- Score de correspondance IA (50%-99%)
- Dates de soumission (1-30 jours dans le passé)
- Dates de consultation (pour les vues)
- Dates d'entretien (pour les entretiens planifiés)
- Notes du recruteur (pour certaines)

### 🔖 Emplois Sauvegardés (~53)
- Chaque candidat sauvegarde 1-4 offres d'emploi
- Favoris/Bookmarks pour consultation ultérieure

### 💳 Paiements (~18)

**Pour les recruteurs avec abonnement actif** :
- 1-3 paiements historiques
- Montants : 25,000 XOF, 50,000 XOF, 100,000 XOF, 150,000 XOF
- Méthodes : Mobile Money, Stripe, Manuel
- Statut : Complété (avec ID de transaction)
- Validité : 30 jours à partir du paiement

**Pour les autres recruteurs** :
- 0-1 paiement
- Statuts variés : En attente, Échoué, ou Complété

### 🔔 Notifications (~234)

**Types variés** :
- Compte créé
- Candidature soumise
- Changement de statut de candidature
- Nouvelle correspondance d'emploi
- Nouveau message
- Rappel de paiement

**Canaux** :
- Email
- WhatsApp
- In-App (dans l'application)

**Détails** :
- 3-8 notifications par utilisateur
- Dates sur les 30 derniers jours
- Statut lu/non lu (50/50)
- Toutes marquées comme envoyées

## 📊 Statistiques Totales

Avec les paramètres par défaut (20 candidats, 10 recruteurs, 30 jobs) :

| Type de Données | Quantité | Notes |
|----------------|----------|-------|
| Utilisateurs | 31 | 1 admin + 20 candidats + 10 recruteurs |
| Profils Candidats | 20 | Tous avec profils 60-95% complets |
| Profils Recruteurs | 10 | ~70% avec abonnement actif |
| Offres d'Emploi | 30 | ~21 publiées, ~6 brouillons, ~3 fermées |
| Candidatures | ~80-90 | Moyenne de 3-4 par candidat |
| Emplois Sauvegardés | ~50-60 | Moyenne de 2-3 par candidat |
| Paiements | ~15-20 | Principalement pour recruteurs actifs |
| Notifications | ~230-250 | ~8 par utilisateur |

## 🎬 Scénarios de Présentation

### Scénario 1 : Dashboard Candidat
1. Se connecter en tant que candidat
2. Voir les offres d'emploi recommandées
3. Postuler à une offre
4. Consulter ses candidatures en cours
5. Vérifier ses notifications

### Scénario 2 : Dashboard Recruteur
1. Se connecter en tant que recruteur
2. Voir ses offres d'emploi publiées
3. Consulter les candidatures reçues
4. Filtrer par score de correspondance
5. Présélectionner un candidat
6. Planifier un entretien

### Scénario 3 : Panel Admin
1. Se connecter en tant qu'admin
2. Voir les statistiques globales
3. Gérer les utilisateurs
4. Modérer les offres d'emploi
5. Consulter les paiements

## 💡 Conseils pour la Présentation

1. **Avant de commencer** :
   - Vérifiez que toutes les données sont chargées
   - Testez chaque compte (admin, candidat, recruteur)
   - Préparez un scénario de démonstration

2. **Pendant la présentation** :
   - Montrez la diversité des profils candidats
   - Démontrez le processus de candidature
   - Illustrez le matching IA avec les scores
   - Présentez le tableau de bord recruteur
   - Montrez les notifications en temps réel

3. **Points à mettre en valeur** :
   - Interface intuitive et moderne
   - Données riches et complètes
   - Fonctionnalités multi-rôles
   - Système de notifications multi-canal
   - Gestion des paiements et abonnements

## 🔄 Régénérer les Données

Si vous voulez de nouvelles données aléatoires :

```bash
python manage.py seed_data --clear
```

Chaque exécution génère :
- De nouveaux noms et emails
- De nouvelles entreprises
- De nouvelles offres d'emploi
- Des données complètement différentes

**Bonne présentation ! 🎉**
