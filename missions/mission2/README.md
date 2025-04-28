# Mission 2️⃣ : Modernisation du Système de Navigation

## Contexte
Après la migration des composants en standalone, le système de navigation de la station spatiale Orion nécessite une mise à jour. Le système de routage actuel doit être modernisé pour utiliser l'approche recommandée en Angular v17.

## Objectif général
Migrer le système de routage de l'application vers l'approche moderne avec provideRouter et des routes standalone.

## État initial
Le système utilise :
- Un système de routing traditionnel avec RouterModule
- Des modules de routage par feature
- Pas de lazy loading optimisé

## Concepts couverts
- Migration vers provideRouter
- Configuration du lazy loading
- Preloading strategies
- Guards et resolvers modernes

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Moderniser le routage principal.

**Tâches**:
1. Créer le fichier app.routes.ts
2. Configurer les routes principales (Home, Missions, Resources)
3. Remplacer RouterModule.forRoot par provideRouter
4. Mettre à jour les liens de navigation

**Compétences acquises**:
- Configuration moderne du routage
- Utilisation de provideRouter
- Navigation de base

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Implémenter le lazy loading pour les features.

**Tâches**:
1. Configurer le lazy loading pour Control Center et Crew
2. Implémenter une preloading strategy personnalisée
3. Ajouter des indicateurs de chargement
4. Gérer la navigation programmatique

**Compétences acquises**:
- Configuration du lazy loading
- Gestion des preloading strategies
- Optimisation du chargement

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Optimiser la navigation et la sécurité.

**Tâches**:
1. Migrer les guards vers l'approche fonctionnelle
2. Moderniser les resolvers
3. Implémenter la récupération d'erreurs de navigation
4. Optimiser les performances de navigation

**Compétences acquises**:
- Guards et resolvers modernes
- Gestion avancée des erreurs
- Optimisation des performances

## Livrables attendus

1. Configuration moderne du routing
2. Lazy loading pour toutes les features
3. Guards et resolvers optimisés
4. Navigation fluide et performante