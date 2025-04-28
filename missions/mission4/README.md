# Mission 4️⃣ : Optimisation des Types et Modèles de Données

## Contexte
Le centre de commandement a signalé des problèmes d'intégrité des données et des erreurs d'exécution dans le système. Pour assurer la fiabilité de la station spatiale Orion, nous devons renforcer le typage TypeScript et mettre en place des modèles de données plus robustes.

## Objectif général
Améliorer la robustesse de l'application en implémentant un typage strict et des modèles de données optimisés pour réduire les erreurs potentielles et faciliter la maintenance future.

## État initial
Le système contient actuellement :
- Une configuration TypeScript basique
- Des types et interfaces dispersés
- Des modèles de données non optimisés
- Des validations de données limitées

## Concepts couverts
- Configuration TypeScript stricte
- Interfaces et Types en TypeScript
- Data Transfer Objects (DTOs)
- Types utilitaires (Omit, Pick, Partial)
- Types discriminés et Guards
- Organisation des modèles de données

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Mettre en place la configuration de base et les modèles initiaux.

**Tâches**:
1. Configurer tsconfig.json avec les paramètres stricts
2. Créer les interfaces de base dans /models
3. Organiser les modèles par fonctionnalité
4. Implémenter la documentation JSDoc basique

**Compétences acquises**:
- Configuration TypeScript
- Création d'interfaces
- Organisation des modèles
- Documentation de base

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Implémenter des types avancés et DTOs.

**Tâches**:
1. Créer des types dérivés avec les utilitaires TypeScript
2. Implémenter les DTOs pour la validation des données
3. Utiliser les types génériques
4. Mettre en place des types pour la gestion d'état

**Compétences acquises**:
- Types utilitaires avancés
- Création de DTOs
- Types génériques
- Gestion d'état typée

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Optimiser avec des types discriminés et la validation.

**Tâches**:
1. Implémenter des types discriminés pour les états système
2. Créer des constantes typées pour les valeurs prédéfinies
3. Mettre en place des guards de type
4. Implémenter la validation complète des données

**Compétences acquises**:
- Types discriminés
- Type guards
- Validation avancée
- Constantes typées

## Livrables attendus

1. Configuration TypeScript optimisée
2. Modèles de données organisés et documentés
3. Types et interfaces robustes
4. Système de validation complet

## Exemple de mise en œuvre

### Configuration TypeScript

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### Modèles de base

```typescript
// models/mission.model.ts
export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  startDate: Date;
  endDate?: Date;
}

export type MissionStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
```

### Types avancés

```typescript
// types/mission.types.ts
export type MissionSummary = Pick<Mission, 'id' | 'name' | 'status'>;
export type UpdateMission = Partial<Mission>;
export type MissionsById = Record<string, Mission>;

// dto/mission.dto.ts
export interface CreateMissionDto extends Omit<Mission, 'id'> {
  crewIds: string[];
}
```

### Types discriminés

```typescript
// types/system-status.types.ts
export type SystemStatus = 
  | { state: 'operational'; performance: number }
  | { state: 'error'; message: string }
  | { state: 'maintenance'; duration: number };

// guards/system-status.guard.ts
export function isOperational(status: SystemStatus): status is { state: 'operational'; performance: number } {
  return status.state === 'operational';
}
```