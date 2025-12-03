# Guide Rapide - Remplir la Base de Données

## 🚀 Démarrage Rapide

Cette commande remplit automatiquement la base de données avec des données réalistes pour votre présentation vidéo.

### Étape 1 : Installation des dépendances

```bash
cd backend
pip install -r requirements.txt
```

### Étape 2 : Configurer la base de données

#### Option A : Avec Docker (Recommandé)

```bash
# Démarrer PostgreSQL et Redis
docker-compose up -d db redis

# Attendre que la base de données soit prête (environ 10 secondes)
sleep 10
```

#### Option B : Sans Docker

Assurez-vous que PostgreSQL est installé et démarré, puis créez une base de données :

```bash
createdb recruitsss
```

### Étape 3 : Appliquer les migrations

```bash
cd backend
python manage.py migrate
```

### Étape 4 : Remplir la base de données 🎉

```bash
python manage.py seed_data --clear
```

Cette commande va créer :
- ✅ 1 compte administrateur
- ✅ 20 candidats avec profils complets
- ✅ 10 recruteurs avec entreprises
- ✅ 30 offres d'emploi variées
- ✅ ~80 candidatures
- ✅ ~60 emplois sauvegardés
- ✅ ~20 paiements
- ✅ ~200 notifications

**Durée estimée : 10-30 secondes** ⏱️

### Étape 5 : Démarrer le serveur

```bash
python manage.py runserver
```

Ou avec Docker :

```bash
docker-compose up
```

### Étape 6 : Se connecter

Ouvrez votre navigateur et allez sur :
- **Backend API** : http://localhost:8000
- **Admin Django** : http://localhost:8000/admin

Utilisez ces identifiants :

#### 👨‍💼 Administrateur
- Email: `admin@recruitsss.com`
- Mot de passe: `Admin123!`

#### 👤 Candidat (exemple)
- Email: `candidate1@example.com`
- Mot de passe: `Password123!`

#### 🏢 Recruteur (exemple)
- Email: `recruiter1@example.com`
- Mot de passe: `Password123!`

---

## 📊 Pour une démo plus impressionnante

Créez beaucoup plus de données :

```bash
python manage.py seed_data --clear --candidates 100 --recruiters 30 --jobs 150
```

Cela générera :
- 100 candidats
- 30 recruteurs
- 150 offres d'emploi
- ~400 candidatures
- Notifications et paiements proportionnels

**Durée estimée : 30-60 secondes** ⏱️

---

## ⚡ Commandes Utiles

### Voir toutes les options
```bash
python manage.py help seed_data
```

### Remplir avec des quantités personnalisées
```bash
python manage.py seed_data --candidates 50 --recruiters 15 --jobs 80
```

### Ajouter des données sans effacer l'existant
```bash
python manage.py seed_data --candidates 10
```

### Vérifier les données créées
```bash
# Via Django shell
python manage.py shell

>>> from users.models import User, Candidate, Recruiter
>>> from jobs.models import JobOffer
>>> from applications.models import Application
>>> 
>>> print(f"Utilisateurs: {User.objects.count()}")
>>> print(f"Candidats: {Candidate.objects.count()}")
>>> print(f"Recruteurs: {Recruiter.objects.count()}")
>>> print(f"Offres d'emploi: {JobOffer.objects.count()}")
>>> print(f"Candidatures: {Application.objects.count()}")
```

---

## 🎬 Checklist pour la Présentation Vidéo

- [ ] Base de données PostgreSQL démarrée
- [ ] Migrations appliquées (`python manage.py migrate`)
- [ ] Données de démonstration chargées (`python manage.py seed_data --clear`)
- [ ] Serveur démarré (`python manage.py runserver` ou `docker-compose up`)
- [ ] Comptes de test vérifiés (admin, candidat, recruteur)
- [ ] Interface testée et fonctionnelle

---

## ❓ Problèmes Courants

### "Faker is not installed"
```bash
pip install Faker==33.1.0
```

### "No module named 'django'"
```bash
pip install -r requirements.txt
```

### "database does not exist"
```bash
# Avec Docker
docker-compose up -d db

# Sans Docker
createdb recruitsss
```

### "FATAL: password authentication failed"
Vérifiez vos variables d'environnement ou créez un fichier `.env` :

```env
DB_NAME=recruitsss
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

---

## 📖 Documentation Complète

Pour plus de détails, consultez le fichier `SEED_DATA_README.md`

---

**Bon courage pour votre présentation ! 🎉**
