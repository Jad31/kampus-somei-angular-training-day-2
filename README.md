# 🚀 CodeQuest: La Station Spatiale Orion

## Introduction

Bienvenue à l'Agence Spatiale Internationale ! CodeQuest est un projet d'apprentissage progressif d'Angular qui simule la mise à jour du système d'exploitation "Orion OS" pour une station spatiale, en migrant d'Angular v15 vers Angular v17. Ce parcours est conçu pour trois niveaux de développeurs (junior, intermédiaire, senior) et couvre les principales nouveautés d'Angular à travers une série de missions.

## 📋 Vue d'ensemble

Le système Orion OS, actuellement en Angular v15, doit être migré vers Angular v17 pour améliorer :
- Les performances et la stabilité de la station
- La maintenance et l'évolutivité du code
- La sécurité des opérations spatiales
- L'expérience utilisateur des astronautes

Cette migration doit être effectuée module par module, sans interrompre le fonctionnement critique de la station.

## 🎯 Objectifs pédagogiques

- Maîtriser la migration vers les composants standalone
- Adopter la nouvelle syntaxe de control flow (@if, @for, @switch)
- Moderniser l'architecture de routage
- Optimiser l'utilisation de TypeScript
- Améliorer les formulaires réactifs
- Mettre à jour les interactions API
- Maximiser l'utilisation de RxJS
- Moderniser la gestion d'état
- Optimiser la détection de changements
- Intégrer les Signals d'Angular

## 👨‍🚀 Niveaux de difficulté

Chaque mission propose trois niveaux de difficulté :
- **Niveau Recrue** : Pour les développeurs juniors, se concentre sur les bases de la migration
- **Niveau Technicien** : Pour les développeurs intermédiaires, ajoute des fonctionnalités plus complexes
- **Niveau Commandant** : Pour les développeurs seniors, implique des optimisations avancées

## 🛠️ Configuration du projet

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Angular CLI (v17 ou supérieur)

### Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/votre-organisation/codequest.git
cd codequest
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en mode développement :
```bash
npm start
```

L'application sera disponible à l'adresse `http://localhost:4200/`.

## 📚 Structure du projet

```
codequest/
├── src/
│   ├── app/
│   │   ├── core/               # Services et logique métier essentiels
│   │   ├── features/           # Modules fonctionnels par domaine
│   │   ├── shared/             # Composants, directives et pipes partagés
│   │   ├── app.component.ts    # Composant racine
│   │   ├── app.module.ts       # Module principal (à migrer)
│   │   └── app-routing.module.ts # Routage principal (à migrer)
│   ├── assets/                 # Images, fonts, etc.
│   └── styles/                 # Styles globaux
├── missions/                   # Instructions des missions et exercices
├── angular.json                # Configuration Angular
├── package.json                # Dépendances
├── tsconfig.json               # Configuration TypeScript
└── README.md                   # Ce fichier
```

## 🚀 Missions

Le projet est divisé en 11 missions de migration :

1. **Migration vers les Composants Standalone** - Conversion des NgModules
2. **Modernisation du Système de Navigation** - Mise à jour du routage
3. **Restructuration de l'Architecture** - Organisation modulaire moderne
4. **Optimisation des Modèles de Données** - Amélioration avec TypeScript
5. **Mise à Niveau des Interfaces de Contrôle** - Formulaires réactifs modernes
6. **Amélioration des Communications** - Interactions API avancées
7. **Optimisation du Système de Capteurs** - Programmation réactive avec RxJS
8. **Refonte de la Gestion d'État** - State management moderne
9. **Avancées pour les Ressources Critiques** - NgRx (optionnel)
10. **Optimisation des Performances** - Change Detection améliorée
11. **Système de Contrôle Nouvelle Génération** - Signals

## 🛰️ Progression

Pour avancer dans les missions :

1. Lisez les instructions dans le dossier `missions/missionX/`
2. Analysez le code existant à migrer
3. Implémentez les transformations demandées
4. Vérifiez que le système fonctionne correctement après chaque migration
5. Passez à la mission suivante une fois la migration actuelle terminée

## 🔧 Commandes disponibles

- `npm start` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run lint` - Vérifie le code avec ESLint
- `npm run format` - Formate le code avec Prettier

## 📝 Conventions de code

- Suivez les [Angular Style Guide](https://angular.io/guide/styleguide)
- Utilisez TypeScript strict mode
- Documentez vos composants et services avec JSDoc
- Suivez les principes SOLID

## 🌐 Ressources utiles

- [Guide de migration Angular](https://angular.io/guide/updating)
- [Documentation sur les composants standalone](https://angular.io/guide/standalone-components)
- [Guide sur la nouvelle syntaxe de control flow](https://angular.io/guide/control_flow)
- [Documentation sur les Signals](https://angular.io/guide/signals)
- [Guide des formulaires réactifs typés](https://angular.io/guide/typed-forms)

## 🤝 Contribution

Ce projet est conçu à des fins éducatives. Si vous souhaitez contribuer, n'hésitez pas à soumettre une pull request ou à signaler des problèmes.

## 📜 Licence

Ce projet est sous licence MIT.

---

Bon courage dans vos missions de mise à jour de la station spatiale Orion ! 🚀