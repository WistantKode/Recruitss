# Stratégie de Branches

Ce document définit la stratégie et la convention de nommage des branches pour le projet "recruitsss".

## Stratégie : "GitHub Flow" Amélioré

Nous adoptons une stratégie basée sur le "GitHub Flow", reconnue pour sa simplicité et son efficacité.

### Branches Principales

1.  **`main`** :
    *   **Rôle** : Contient la version de production, stable et déployée.
    *   **Règles** : Aucune modification directe. Les mises à jour se font exclusivement via des Pull Requests validées depuis la branche `develop`.

2.  **`develop`** :
    *   **Rôle** : Branche principale de développement. Elle intègre les fonctionnalités et corrections stables, prêtes pour la prochaine release.
    *   **Règles** : Sert de base pour toutes les nouvelles branches de travail.

### Branches de Travail (Feature Branches)

Chaque nouvelle fonctionnalité, correction ou amélioration est développée dans une branche isolée pour garantir la stabilité de `develop`.

#### Convention de Nommage

Le nommage des branches suit un format structuré pour une lisibilité maximale :

**`type/scope/short-description`**

---

**1. `type`** : Nature du travail (basé sur le standard Angular) :
*   `feat` : Développement d'une nouvelle fonctionnalité.
*   `fix` : Correction d'un bug.
*   `refactor` : Amélioration du code existant sans ajout de fonctionnalité.
*   `chore` : Tâches de maintenance (mise à jour de dépendances, configuration CI/CD, etc.).
*   `docs` : Rédaction ou mise à jour de la documentation.

**2. `scope`** : Périmètre fonctionnel ou technique concerné.
*   Exemples : `auth`, `jobs`, `profile`, `admin`, `payments`, `ci`, `deps`.

**3. `short-description`** : Description concise en anglais, utilisant des tirets (`-`) comme séparateurs.

---

#### Exemples Concrets

*   `feat/auth/add-password-reset`
*   `fix/jobs/pagination-error`
*   `refactor/profile/use-custom-hook-for-data-fetching`
*   `chore/deps/upgrade-nextjs-17`

## Feuille de Route des Branches Initiales (Frontend)

Voici les premières branches de travail proposées. Elles doivent toutes être créées à partir de `develop`.

1.  **`feat/auth/implement-magic-link`**
    *   **Objectif** : Ajouter une connexion sans mot de passe via des liens magiques.

2.  **`refactor/jobs/optimize-job-list-rendering`**
    *   **Objectif** : Optimiser le rendu de la liste des offres d'emploi pour améliorer les performances.

3.  **`feat/profile/add-resume-upload`**
    *   **Objectif** : Permettre aux utilisateurs de télécharger leur CV sur leur profil.

4.  **`fix/admin/dashboard-data-not-refreshing`**
    *   **Objectif** : Corriger la mise à jour des données sur le tableau de bord administrateur.

5.  **`chore/deps/upgrade-react-query-v5`**
    *   **Objectif** : Mettre à jour TanStack Query (React Query) vers la dernière version majeure.
