# Mission 6️⃣ : Intégration API pour la Gestion des Missions

## Contexte
Le système de gestion des missions CodeQuest doit être connecté à une API backend pour persister les données des missions et permettre une collaboration en temps réel. Actuellement, le système utilise un stockage en mémoire via des services, qui doit être mis à niveau pour utiliser une communication API appropriée.

## Objectif Général
Migrer le système de gestion des missions pour utiliser HttpClient pour la communication API, en implémentant une gestion appropriée des erreurs, des intercepteurs, et en suivant les meilleures pratiques d'Angular 17.

## État Initial
Le système utilise actuellement :
- Un stockage en mémoire dans le `MissionService`
- Aucune communication API
- Une gestion basique des erreurs
- Pas de persistance des données

## Concepts Couverts
- HttpClient avec typage fort
- Architecture des services pour la communication API
- Intercepteurs fonctionnels modernes
- Stratégies de gestion des erreurs et de réessai
- Modèles de communication composant-service-API

## Détail des Niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif** : Mettre à jour le service de mission de base pour utiliser HttpClient.

**Tâches** :
1. Mettre à jour `MissionService` pour utiliser HttpClient :
   - Remplacer le tableau en mémoire par des appels API
   - Ajouter un typage fort pour les réponses API
   - Créer des DTOs pour les données de mission
2. Implémenter la gestion basique des erreurs avec catchError
3. Mettre à jour les composants pour gérer correctement les données asynchrones
4. Configurer les URLs de l'API via l'environnement

**Compétences Acquises** :
- Utilisation de HttpClient avec typage
- Manipulation des observables HTTP
- Configuration de base des services API
- Gestion des erreurs HTTP

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif** : Développer une architecture API complète avec des fonctionnalités avancées.

**Tâches** :
1. Créer des services API spécialisés :
   - `MissionApiService` pour les opérations CRUD
   - `CrewApiService` pour la gestion de l'équipage
   - `ObjectiveApiService` pour les objectifs de mission
2. Implémenter les opérations CRUD complètes avec typage :
   - GET, POST, PUT, DELETE avec les types appropriés
   - Paramètres de requête typés
   - En-têtes personnalisés
3. Ajouter des fonctionnalités avancées :
   - Suivi de la progression pour les opérations longues
   - Réessai automatique pour les échecs temporaires
   - Mapping des réponses avec les pipes RxJS
4. Créer un service centralisé de gestion des erreurs

**Compétences Acquises** :
- Architecture de services API par domaine
- Opérations CRUD complètes et typées
- Transformation de données avec RxJS
- Stratégies avancées de gestion des erreurs

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif** : Implémenter des intercepteurs modernes et une infrastructure API robuste.

**Tâches** :
1. Créer des intercepteurs fonctionnels :
   - Intercepteur d'authentification pour la gestion des tokens
   - Intercepteur de logging pour le suivi des requêtes/réponses
   - Intercepteur de gestion des erreurs
   - Intercepteur de cache pour les requêtes GET
2. Implémenter des fonctionnalités de résilience API :
   - File d'attente des requêtes pour le mode hors ligne
   - Stratégies de réessai avec backoff
   - Gestion de l'annulation des requêtes
3. Ajouter des mises à jour en temps réel :
   - Intégration WebSocket pour les mises à jour de mission
   - Changements de statut en temps réel
   - Fonctionnalités collaboratives
4. Implémenter des tests complets :
   - Tests unitaires des services
   - Tests des intercepteurs
   - Tests d'intégration

**Compétences Acquises** :
- Intercepteurs fonctionnels modernes
- Configuration avancée de HttpClient
- Gestion des données en temps réel
- Stratégies de test API

## Exemple d'Implémentation

### DTO de Mission

```typescript
export interface MissionDto {
  id: string;
  title: string;
  status: MissionStatus;
  priority: MissionPriority;
  startDate: string;
  description: string;
  crewMembers: CrewMemberDto[];
  objectives: ObjectiveDto[];
}

export interface CreateMissionDto {
  title: string;
  priority: MissionPriority;
  startDate: string;
  description: string;
}

export type UpdateMissionDto = Partial<CreateMissionDto>;
```

### Service de Mission Mis à Jour

```typescript
@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = inject(ENVIRONMENT).apiBaseUrl + '/missions';
  private http = inject(HttpClient);
  
  getMissions(): Observable<MissionDto[]> {
    return this.http.get<MissionDto[]>(this.apiUrl);
  }
  
  getMissionById(id: string): Observable<MissionDto> {
    return this.http.get<MissionDto>(`${this.apiUrl}/${id}`);
  }
  
  createMission(mission: CreateMissionDto): Observable<MissionDto> {
    return this.http.post<MissionDto>(this.apiUrl, mission);
  }
  
  updateMission(id: string, changes: UpdateMissionDto): Observable<MissionDto> {
    return this.http.put<MissionDto>(`${this.apiUrl}/${id}`, changes);
  }
  
  deleteMission(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

## Livrables Attendus

1. Services de mission mis à jour avec intégration API
2. DTOs pour toutes les entités liées aux missions
3. Intercepteurs fonctionnels pour l'authentification, le logging et les erreurs
4. Système centralisé de gestion des erreurs
5. Capacités de mise à jour en temps réel
6. Couverture de tests complète

Cette intégration API améliorera le système de gestion des missions en fournissant la persistance des données, des capacités de collaboration en temps réel et une architecture plus robuste pour les évolutions futures. 