# Mission 8️⃣ : Gestion d'État avec Services

## Contexte
La complexité croissante du système d'exploitation Orion entraîne des problèmes de cohérence des données entre ses différents modules. L'état des ressources, des missions et des astronautes est actuellement géré de manière disparate, avec des données dupliquées et désynchronisées entre les composants. Pour améliorer la fiabilité et faciliter la maintenance, vous devez mettre en place un système centralisé de gestion d'état basé sur les services RxJS.

## Objectif général
Implémenter une architecture de gestion d'état basée sur le pattern BehaviorSubject/Observable qui centralise les données partagées, simplifie les composants et améliore la maintenabilité du système Orion.

## État initial
Le système actuel présente plusieurs problèmes :
- État distribué dans différents composants
- Duplication de données conduisant à des incohérences
- Communication complexe entre composants non liés
- Difficultés de débogage des changements d'état
- Composants surchargés de logique d'état

## Concepts couverts
- Principes de la gestion d'état centralisée
- Pattern BehaviorSubject → next() → asObservable()
- Choix des outils RxJS appropriés (Observable, Subject, BehaviorSubject)
- Création de services de store
- Architecture de composants "stupides" (stateless)

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Créer un service de store simple pour gérer l'état des missions.

**Tâches**:
1. Développer un `MissionStore` basique:
   - Utiliser BehaviorSubject pour stocker la liste des missions
   - Exposer un Observable avec asObservable()
   - Implémenter des méthodes de mutation (add, update, remove)
2. Modifier le composant `MissionsComponent` pour utiliser le store:
   - Remplacer l'appel direct au service par l'utilisation du store
   - Utiliser le pipe async dans le template
   - Mettre à jour les méthodes de modification pour passer par le store
3. Mettre en place un système de synchronisation:
   - Charger les données depuis l'API dans le store
   - Mettre à jour le store après chaque modification
   - Gérer les états de chargement et d'erreur

**Compétences acquises**:
- Utilisation du pattern BehaviorSubject/Observable
- Création d'un service de store simple
- Simplification des composants grâce à la centralisation de l'état
- Utilisation correcte du pipe async

### Exemple de code pour le niveau junior

```typescript
// mission.store.ts
@Injectable({
  providedIn: 'root'
})
export class MissionStore {
  private missionsSubject = new BehaviorSubject<Mission[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Observables publics
  readonly missions$ = this.missionsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  
  // Observable dérivé pour les missions actives
  readonly activeMissions$ = this.missions$.pipe(
    map(missions => missions.filter(m => m.status === 'in-progress'))
  );
  
  // Observable pour les statistiques
  readonly stats$ = this.missions$.pipe(
    map(missions => ({
      totalMissions: missions.length,
      activeMissions: missions.filter(m => m.status === 'in-progress').length,
      successRate: this.calculateSuccessRate(missions)
    }))
  );
  
  constructor(private missionsService: MissionsService) {
    this.loadMissions();
  }
  
  // Actions
  loadMissions(): void {
    this.loadingSubject.next(true);
    this.missionsService.getAllMissions().pipe(
      tap(missions => {
        this.missionsSubject.next(missions);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.errorSubject.next('Erreur lors du chargement des missions');
        this.loadingSubject.next(false);
        return EMPTY;
      })
    ).subscribe();
  }
  
  startMission(missionId: string): void {
    this.missionsService.updateMissionStatus(missionId, 'in-progress').pipe(
      switchMap(() => this.missionsService.getAllMissions()),
      tap(missions => this.missionsSubject.next(missions))
    ).subscribe();
  }
  
  completeMission(missionId: string): void {
    this.missionsService.updateMissionStatus(missionId, 'completed').pipe(
      switchMap(() => this.missionsService.getAllMissions()),
      tap(missions => this.missionsSubject.next(missions))
    ).subscribe();
  }
  
  private calculateSuccessRate(missions: Mission[]): number {
    const completed = missions.filter(m => m.status === 'completed').length;
    return missions.length > 0 ? Math.round((completed / missions.length) * 100) : 0;
  }
}

// missions.component.ts
@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (missions$ | async; as missions) {
      <div class="missions-grid">
        @for (mission of missions; track mission.id) {
          <div class="mission-card" [class]="getPriorityClass(mission.priority)">
            <h3>{{ mission.name }}</h3>
            <div class="status" [class]="getStatusClass(mission.status)">
              {{ mission.status }}
            </div>
            <div class="details">
              <div>Priorité: {{ mission.priority }}</div>
              <div>Date de début: {{ mission.startDate | date }}</div>
              @if (mission.endDate) {
                <div>Date de fin: {{ mission.endDate | date }}</div>
              }
            </div>
            <div class="actions">
              <button (click)="startMission(mission.id)">Démarrer</button>
              <button (click)="completeMission(mission.id)">Terminer</button>
            </div>
          </div>
        }
      </div>
    } @else if (loading$ | async) {
      <div class="loading">Chargement des missions...</div>
    } @else if (error$ | async; as error) {
      <div class="error">{{ error }}</div>
    }
  `
})
export class MissionsComponent {
  private missionStore = inject(MissionStore);
  
  // Utilisation des Observables du store
  missions$ = this.missionStore.missions$;
  loading$ = this.missionStore.loading$;
  error$ = this.missionStore.error$;
  stats$ = this.missionStore.stats$;
  
  startMission(missionId: string): void {
    this.missionStore.startMission(missionId);
  }
  
  completeMission(missionId: string): void {
    this.missionStore.completeMission(missionId);
  }
  
  getPriorityClass(priority: MissionPriority): string {
    return `priority-${priority}`;
  }
  
  getStatusClass(status: MissionStatus): string {
    return `status-${status}`;
  }
}
```

## Choix des outils RxJS pour le state

| Type | Peut émettre ? | Valeur initiale ? | Utilisation |
|------|---------------|-----------------|-------------|
| `Observable` | ❌ non | ❌ | Consommer (API, RxJS natif) |
| `Subject` | ✅ oui | ❌ | Events, flux live |
| `BehaviorSubject` | ✅ oui | ✅ | Stocker & exposer un état |

### Pattern BehaviorSubject → next() → asObservable()

```typescript
@Injectable({ providedIn: 'root' })
export class MissionStore {
  // 1. BehaviorSubject privé avec valeur initiale
  private readonly missionsSubject = new BehaviorSubject<Mission[]>([]);
  
  // 2. Observable exposé en lecture seule
  readonly missions$ = this.missionsSubject.asObservable();
  
  // 3. Méthodes de mutation contrôlée
  updateMissions(missions: Mission[]) {
    this.missionsSubject.next(missions);
  }
}
```

### Avantages du pattern de state management avec BehaviorSubject

- **Simplicité** : Pas de boilerplate complexe
- **Natif pour Angular** : Utilisation des outils RxJS intégrés
- **Lecture fluide** : Propriétés observables dans les templates
- **Facilement extensible** : Combinaison avec d'autres opérateurs RxJS
- **Compatible standalone** : Fonctionne parfaitement avec les composants standalone
- **Déclaratif** : Pattern lisible et maintenable

## Livrables attendus

Pour cette mission, vous devrez:

1. Créer un service de store pour les missions
2. Modifier le composant MissionsComponent pour utiliser le store
3. Implémenter les opérations CRUD dans le store
4. Gérer les états de chargement et d'erreur dans le store
5. Mettre en place un système de synchronisation avec l'API

Cette implémentation de gestion d'état permettra d'améliorer considérablement la cohérence des données dans le système Orion, de simplifier les composants et de faciliter les futures évolutions de l'application.