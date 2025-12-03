# Seed Data Command - Documentation

Cette commande Django permet de remplir la base de données avec des données de démonstration réalistes, parfaites pour les présentations et les tests.

## Installation

La dépendance Faker est nécessaire pour générer des données réalistes. Elle a été ajoutée au fichier `requirements.txt`.

Pour installer toutes les dépendances :

```bash
cd backend
pip install -r requirements.txt
```

## Utilisation

### Commande de base

Pour remplir la base de données avec les valeurs par défaut :

```bash
python manage.py seed_data
```

Cette commande créera :
- 1 administrateur
- 20 candidats avec profils complets
- 10 recruteurs avec entreprises
- 30 offres d'emploi
- Candidatures (chaque candidat postule à 2-5 offres)
- Emplois sauvegardés
- Paiements pour les recruteurs
- Notifications pour tous les utilisateurs

### Options disponibles

#### Nombre de candidats personnalisé

```bash
python manage.py seed_data --candidates 50
```

#### Nombre de recruteurs personnalisé

```bash
python manage.py seed_data --recruiters 20
```

#### Nombre d'offres d'emploi personnalisé

```bash
python manage.py seed_data --jobs 100
```

#### Combiner plusieurs options

```bash
python manage.py seed_data --candidates 30 --recruiters 15 --jobs 50
```

#### Effacer les données existantes avant de remplir

**⚠️ ATTENTION : Cette option supprime TOUTES les données existantes !**

```bash
python manage.py seed_data --clear
```

Ou combiné avec d'autres options :

```bash
python manage.py seed_data --clear --candidates 50 --recruiters 20 --jobs 100
```

## Comptes de test créés

Après l'exécution de la commande, vous pouvez vous connecter avec :

### Administrateur
- **Email** : `admin@recruitsss.com`
- **Mot de passe** : `Admin123!`

### Candidat (exemple)
- **Email** : `candidate1@example.com`
- **Mot de passe** : `Password123!`

### Recruteur (exemple)
- **Email** : `recruiter1@example.com`
- **Mot de passe** : `Password123!`

*Note : Les emails exacts des candidats et recruteurs varient car ils sont générés aléatoirement.*

## Données générées

### Candidats
- Profils complets avec bio, compétences, expérience
- CV et photos de profil (URLs simulées)
- Liens LinkedIn, GitHub, Portfolio
- Localisation : villes d'Afrique de l'Ouest et France
- Disponibilité et attentes salariales

### Recruteurs
- Informations d'entreprise complètes
- Secteurs variés (Tech, Finance, Santé, etc.)
- Statuts d'abonnement variés (Actif, En attente, Expiré)
- Sites web et logos d'entreprise

### Offres d'emploi
- Titres de poste variés (Développeur Full Stack, Data Scientist, etc.)
- Descriptions, exigences et responsabilités détaillées
- Salaires en XOF (Franc CFA)
- Types de contrat : CDI, CDD, Freelance, Stage
- Statuts : Publié (70%), Brouillon (20%), Fermé (10%)
- Localisation et option de télétravail

### Candidatures
- Différents statuts : Soumise, Vue, Présélectionnée, Entretien, Acceptée, Rejetée
- Scores de correspondance IA (0.5 - 0.99)
- Lettres de motivation
- Dates d'entretien pour les candidatures planifiées

### Paiements
- Historique de paiements pour les recruteurs
- Méthodes : Mobile Money, Stripe, Manuel
- Montants typiques : 25,000 - 150,000 XOF
- Statuts de transaction

### Notifications
- Notifications multi-canal : Email, WhatsApp, In-App
- Types variés : Création de compte, Candidature, Correspondance d'emploi
- Historique sur 30 jours

## Utilisation pour une présentation

Pour préparer une démo complète :

```bash
# 1. Nettoyer et remplir avec beaucoup de données
python manage.py seed_data --clear --candidates 100 --recruiters 30 --jobs 150

# 2. Démarrer le serveur
python manage.py runserver

# 3. Se connecter avec les comptes de test
```

## Avec Docker

Si vous utilisez Docker :

```bash
# 1. Démarrer les services
docker-compose up -d

# 2. Exécuter la commande dans le conteneur
docker-compose exec backend python manage.py seed_data --clear --candidates 50 --recruiters 20 --jobs 80

# 3. Accéder à l'application
# Backend : http://localhost:8000
# Admin : http://localhost:8000/admin
```

## Données réalistes

La commande utilise la bibliothèque **Faker** pour générer :
- Noms et prénoms réalistes (français et anglais)
- Emails valides
- Numéros de téléphone
- Descriptions et textes cohérents
- Noms d'entreprises
- URLs et références

## Dépannage

### Erreur : "Faker is not installed"

Solution :
```bash
pip install Faker==33.1.0
```

### Erreur de base de données

Assurez-vous que PostgreSQL est en cours d'exécution et que les migrations sont appliquées :

```bash
python manage.py migrate
```

### Conflits de données

Utilisez l'option `--clear` pour supprimer les données existantes :

```bash
python manage.py seed_data --clear
```

## Notes importantes

- La commande utilise des transactions Django pour garantir la cohérence
- Les mots de passe sont hashés correctement avec Django
- Les relations entre modèles sont respectées (clés étrangères)
- Les dates sont réalistes (décalées dans le temps de manière cohérente)
- La commande peut être exécutée plusieurs fois (mais créera des doublons sans `--clear`)

## Pour le développement

Cette commande est idéale pour :
- ✅ Tester l'interface utilisateur avec des données réelles
- ✅ Préparer des démonstrations client
- ✅ Développer et tester de nouvelles fonctionnalités
- ✅ Tester les performances avec beaucoup de données
- ✅ Entraîner de nouveaux membres de l'équipe

⚠️ **NE PAS utiliser en production !**
