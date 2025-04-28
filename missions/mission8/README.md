# Mission 9️⃣ : Gestion d'État avec Services

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

**Objectif**: Créer un service de store simple pour gérer l'état des astronautes.

**Tâches**:
1. Développer un `AstronautStore` basique:
   - Utiliser BehaviorSubject pour stocker la liste des astronautes
   - Exposer un Observable avec asObservable()
   - Implémenter des méthodes de mutation (add, update, remove)
2. Modifier le composant `AstronautListComponent` pour utiliser le store:
   - Remplacer la gestion d'état locale par l'Observable du store
   - Utiliser le pipe async dans le template
3. Mettre à jour le composant `AstronautDetailComponent`:
   - Récupérer les données depuis le store au lieu d'appels API directs
   - Implémenter la persistance des modifications via le store

**Compétences acquises**:
- Utilisation du pattern BehaviorSubject/Observable
- Création d'un service de store simple
- Simplification des composants grâce à la centralisation de l'état
- Utilisation correcte du pipe async

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Développer un système de stores interconnectés avec dérivation d'état.

**Tâches**:
1. Étendre l'architecture avec plusieurs stores spécialisés:
   - `MissionStore` pour gérer les missions
   - `ResourceStore` pour les ressources de la station
   - `SystemStatusStore` pour l'état des systèmes
2. Implémenter la dérivation d'état avec des Observables calculés:
   - Créer des propriétés dérivées (ex: missions actives, ressources critiques)
   - Utiliser des opérateurs comme map, filter, combineLatest
3. Gérer les dépendances entre stores:
   - Synchroniser les données entre stores différents
   - Maintenir la cohérence lors des mises à jour
4. Créer un tableau de bord qui affiche des données de plusieurs stores

**Compétences acquises**:
- Architecture de stores multiples
- Création d'état dérivé avec RxJS
- Gestion des dépendances entre sources de données
- Techniques avancées de transformation de données

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Mettre en place une architecture complète de gestion d'état avec historisation et debuggage.

**Tâches**:
1. Développer un système d'actions typées:
   - Créer des interfaces pour les différentes actions (add, update, remove)
   - Implémenter un dispatcher central pour ces actions
   - Maintenir un historique des actions pour le débogage
2. Ajouter des fonctionnalités avancées:
   - Mécanisme d'annulation/rétablissement (undo/redo)
   - Persistance sélective de l'état (localStorage, IndexedDB)
   - Synchronisation avec le backend
3. Créer un outil de débogage:
   - Visualisation de l'état actuel
   - Journalisation des changements d'état
   - Possibilité de rejouer des séquences d'actions
4. Optimiser les performances:
   - Implémentation de la mémoïzation pour les états dérivés
   - Stratégies de mise à jour sélective

**Compétences acquises**:
- Architecture avancée de gestion d'état
- Techniques d'historisation et débogage
- Patterns d'optimisation de performance
- Persistance et synchronisation d'état

## Exemples de code

### Store simple avec BehaviorSubject

```typescript
// astronaut.model.ts
export interface Astronaut {
  id: string;
  name: string;
  rank: string;
  specialty: string;
  isActive: boolean;
}

// astronaut.store.ts
@Injectable({
  providedIn: 'root'
})
export class AstronautStore {
  // État privé avec BehaviorSubject
  private astronautsSubject = new BehaviorSubject<Astronaut[]>([]);
  
  // Observable public en lecture seule
  readonly astronauts$ = this.astronautsSubject.asObservable();
  
  // Observable dérivé pour les astronautes actifs
  readonly activeAstronauts$ = this.astronauts$.pipe(
    map(astronauts => astronauts.filter(a => a.isActive))
  );
  
  // Observable pour récupérer un astronaute par ID
  getAstronautById(id: string): Observable<Astronaut | undefined> {
    return this.astronauts$.pipe(
      map(astronauts => astronauts.find(a => a.id === id))
    );
  }
  
  // Actions de mutation
  loadAstronauts(astronauts: Astronaut[]): void {
    this.astronautsSubject.next(astronauts);
  }
  
  addAstronaut(astronaut: Astronaut): void {
    const current = this.astronautsSubject.value;
    this.astronautsSubject.next([...current, astronaut]);
  }
  
  updateAstronaut(id: string, changes: Partial<Astronaut>): void {
    const current = this.astronautsSubject.value;
    const updated = current.map(astronaut => 
      astronaut.id === id 
        ? { ...astronaut, ...changes } 
        : astronaut
    );
    this.astronautsSubject.next(updated);
  }
  
  removeAstronaut(id: string): void {
    const current = this.astronautsSubject.value;
    this.astronautsSubject.next(current.filter(a => a.id !== id));
  }
  
  // Méthode pour initialiser les données depuis l'API
  initialize(): void {
    // Injecter le service API et charger les données
    const apiService = inject(AstronautApiService);
    
    apiService.getAstronauts().subscribe(astronauts => {
      this.loadAstronauts(astronauts);
    });
  }
}
```

### Utilisation du store dans un composant

```typescript
// astronaut-list.component.ts
@Component({
  selector: 'app-astronaut-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="astronaut-container">
      <h2>Équipage de la station</h2>
      
      @if (astronauts$ | async; as astronauts) {
        <div class="filter-controls">
          <button (click)="showAll()">Tous</button>
          <button (click)="showActive()">Actifs uniquement</button>
        </div>
        
        <ul class="astronaut-list">
          @for (astronaut of astronauts; track astronaut.id) {
            <li class="astronaut-item" [class.active]="astronaut.isActive">
              <h3>{{ astronaut.name }} - {{ astronaut.rank }}</h3>
              <p>Spécialité: {{ astronaut.specialty }}</p>
              <div class="actions">
                <button (click)="viewDetails(astronaut.id)">Détails</button>
                <button (click)="toggleActive(astronaut)">
                  {{ astronaut.isActive ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </li>
          } @empty {
            <li>Aucun membre d'équipage disponible</li>
          }
        </ul>
      } @else {
        <div class="loading">Chargement de l'équipage...</div>
      }
    </div>
  `
})
export class AstronautListComponent {
  private astronautStore = inject(AstronautStore);
  private router = inject(Router);
  
  // État local pour contrôler quel Observable utiliser
  private showActiveOnly = false;
  
  // Observable qui change selon le filtre
  astronauts$ = this.astronautStore.astronauts$;
  
  showAll(): void {
    this.showActiveOnly = false;
    this.astronauts$ = this.astronautStore.astronauts$;
  }
  
  showActive(): void {
    this.showActiveOnly = true;
    this.astronauts$ = this.astronautStore.activeAstronauts$;
  }
  
  viewDetails(id: string): void {
    this.router.navigate(['/astronauts', id]);
  }
  
  toggleActive(astronaut: Astronaut): void {
    this.astronautStore.updateAstronaut(astronaut.id, {
      isActive: !astronaut.isActive
    });
  }
  
  ngOnInit(): void {
    // Initialiser le store si nécessaire
    this.astronautStore.initialize();
  }
}
```

### Stores interconnectés

```typescript
// mission.store.ts
@Injectable({
  providedIn: 'root'
})
export class MissionStore {
  private missionsSubject = new BehaviorSubject<Mission[]>([]);
  
  readonly missions$ = this.missionsSubject.asObservable();
  
  readonly activeMissions$ = this.missions$.pipe(
    map(missions => missions.filter(m => m.status === 'active'))
  );
  
  // Méthodes de mutation similaires à AstronautStore...
}

// dashboard.component.ts
@Component({
  selector: 'app-mission-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Tableau de bord des missions</h2>
      
      @if (dashboardData$ | async; as data) {
        <div class="stats">
          <div class="stat-card">
            <h3>Astronautes actifs</h3>
            <div class="stat-value">{{ data.activeAstronautsCount }}</div>
          </div>
          <div class="stat-card">
            <h3>Missions en cours</h3>
            <div class="stat-value">{{ data.activeMissionsCount }}</div>
          </div>
          <div class="stat-card">
            <h3>Ressources critiques</h3>
            <div class="stat-value">{{ data.criticalResourcesCount }}</div>
          </div>
        </div>
        
        <div class="mission-astronaut-map">
          <h3>Affectations actuelles</h3>
          <ul>
            @for (assignment of data.assignments; track assignment.missionId) {
              <li>
                <strong>{{ assignment.missionName }}</strong>:
                {{ assignment.astronautNames.join(', ') }}
              </li>
            } @empty {
              <li>Aucune affectation active</li>
            }
          </ul>
        </div>
      } @else {
        <div class="loading">Chargement du tableau de bord...</div>
      }
    </div>
  `
})
export class MissionDashboardComponent {
  private astronautStore = inject(AstronautStore);
  private missionStore = inject(MissionStore);
  private resourceStore = inject(ResourceStore);
  
  // Combinaison de données de plusieurs stores
  dashboardData$ = combineLatest([
    this.astronautStore.astronauts$,
    this.missionStore.missions$,
    this.resourceStore.resources$
  ]).pipe(
    map(([astronauts, missions, resources]) => {
      // Créer une vue combinée pour le tableau de bord
      const activeAstronauts = astronauts.filter(a => a.isActive);
      const activeMissions = missions.filter(m => m.status === 'active');
      const criticalResources = resources.filter(r => r.level < r.criticalThreshold);
      
      // Calculer les affectations mission-astronaute
      const assignments = activeMissions.map(mission => {
        const assignedAstronauts = astronauts.filter(a => 
          mission.crew.includes(a.id)
        );
        
        return {
          missionId: mission.id,
          missionName: mission.name,
          astronautNames: assignedAstronauts.map(a => a.name)
        };
      });
      
      return {
        activeAstronautsCount: activeAstronauts.length,
        activeMissionsCount: activeMissions.length,
        criticalResourcesCount: criticalResources.length,
        assignments
      };
    })
  );
}
```

### Architecture avancée avec actions typées

```typescript
// action.types.ts
export interface Action {
  type: string;
  payload: any;
}

export interface AstronautAddedAction extends Action {
  type: 'astronaut/added';
  payload: Astronaut;
}

export interface AstronautUpdatedAction extends Action {
  type: 'astronaut/updated';
  payload: {
    id: string;
    changes: Partial<Astronaut>;
  };
}

export interface AstronautRemovedAction extends Action {
  type: 'astronaut/removed';
  payload: string; // id
}

export type AstronautAction = 
  | AstronautAddedAction
  | AstronautUpdatedAction
  | AstronautRemovedAction;

// state.service.ts
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private actionsSubject = new Subject<Action>();
  private actionHistory: Action[] = [];
  
  // Observable des actions pour le débogage
  readonly actions$ = this.actionsSubject.asObservable();
  
  // Dispatcher une action
  dispatch(action: Action): void {
    // Enregistrer l'action dans l'historique
    this.actionHistory.push(action);
    
    // Émettre l'action pour les abonnés
    this.actionsSubject.next(action);
    
    // Journaliser pour le débogage
    console.log('Action:', action);
  }
  
  // Obtenir l'historique des actions
  getActionHistory(): Action[] {
    return [...this.actionHistory];
  }
  
  // Effacer l'historique
  clearHistory(): void {
    this.actionHistory = [];
  }
}

// astronaut.store.ts (version avancée)
@Injectable({
  providedIn: 'root'
})
export class AstronautStore {
  private astronautsSubject = new BehaviorSubject<Astronaut[]>([]);
  private stateService = inject(StateService);
  
  readonly astronauts$ = this.astronautsSubject.asObservable();
  
  constructor() {
    // S'abonner aux actions
    this.stateService.actions$.pipe(
      filter((action): action is AstronautAction => 
        action.type.startsWith('astronaut/')
      )
    ).subscribe(action => this.handleAction(action));
  }
  
  // Gestionnaire d'actions
  private handleAction(action: AstronautAction): void {
    const currentState = this.astronautsSubject.value;
    
    switch (action.type) {
      case 'astronaut/added':
        this.astronautsSubject.next([...currentState, action.payload]);
        break;
        
      case 'astronaut/updated':
        this.astronautsSubject.next(
          currentState.map(astronaut => 
            astronaut.id === action.payload.id
              ? { ...astronaut, ...action.payload.changes }
              : astronaut
          )
        );
        break;
        
      case 'astronaut/removed':
        this.astronautsSubject.next(
          currentState.filter(astronaut => astronaut.id !== action.payload)
        );
        break;
    }
  }
  
  // Méthodes publiques pour dispatcher des actions
  addAstronaut(astronaut: Astronaut): void {
    this.stateService.dispatch({
      type: 'astronaut/added',
      payload: astronaut
    });
  }
  
  updateAstronaut(id: string, changes: Partial<Astronaut>): void {
    this.stateService.dispatch({
      type: 'astronaut/updated',
      payload: { id, changes }
    });
  }
  
  removeAstronaut(id: string): void {
    this.stateService.dispatch({
      type: 'astronaut/removed',
      payload: id
    });
  }
}
```

### Composant de débogage

```typescript
// debug-console.component.ts
@Component({
  selector: 'app-debug-console',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-console" *ngIf="isVisible">
      <h2>Console de débogage</h2>
      
      <div class="state-view">
        <h3>État actuel</h3>
        <pre>{{ currentState | json }}</pre>
      </div>
      
      <div class="action-history">
        <h3>Historique des actions</h3>
        <ul>
          @for (action of actionHistory; track $index) {
            <li>
              <span class="action-type">{{ action.type }}</span>
              <pre>{{ action.payload | json }}</pre>
              <button (click)="replayAction(action)">Rejouer</button>
            </li>
          } @empty {
            <li>Aucune action enregistrée</li>
          }
        </ul>
      </div>
      
      <div class="controls">
        <button (click)="clearHistory()">Effacer l'historique</button>
        <button (click)="saveState()">Sauvegarder l'état</button>
        <button (click)="loadState()">Charger l'état</button>
      </div>
    </div>
  `
})
export class DebugConsoleComponent {
  private stateService = inject(StateService);
  private astronautStore = inject(AstronautStore);
  private missionStore = inject(MissionStore);
  
  isVisible = false;
  actionHistory: Action[] = [];
  currentState: any = {};
  
  constructor() {
    // Écouter les actions pour mettre à jour l'historique
    this.stateService.actions$.subscribe(() => {
      this.updateDebugInfo();
    });
    
    // Écouter Ctrl+D pour afficher/masquer la console
    window.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        this.toggleVisibility();
      }
    });
  }
  
  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.updateDebugInfo();
    }
  }
  
  updateDebugInfo(): void {
    this.actionHistory = this.stateService.getActionHistory();
    
    // Combiner les états de tous les stores pour une vue d'ensemble
    combineLatest([
      this.astronautStore.astronauts$,
      this.missionStore.missions$
    ]).pipe(
      take(1)
    ).subscribe(([astronauts, missions]) => {
      this.currentState = {
        astronauts,
        missions
      };
    });
  }
  
  clearHistory(): void {
    this.stateService.clearHistory();
    this.actionHistory = [];
  }
  
  replayAction(action: Action): void {
    this.stateService.dispatch(action);
  }
  
  saveState(): void {
    localStorage.setItem('orion-debug-state', JSON.stringify(this.currentState));
    alert('État sauvegardé');
  }
  
  loadState(): void {
    const savedState = localStorage.getItem('orion-debug-state');
    if (savedState) {
      const state = JSON.parse(savedState);
      
      // Charger l'état dans les stores
      if (state.astronauts) {
        for (const astronaut of state.astronauts) {
          this.astronautStore.addAstronaut(astronaut);
        }
      }
      
      if (state.missions) {
        for (const mission of state.missions) {
          this.missionStore.addMission(mission);
        }
      }
      
      alert('État chargé');
    } else {
      alert('Aucun état sauvegardé');
    }
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
export class UserStore {
  // 1. BehaviorSubject privé avec valeur initiale
  private readonly userSubject = new BehaviorSubject<User | null>(null);
  
  // 2. Observable exposé en lecture seule
  readonly user$ = this.userSubject.asObservable();
  
  // 3. Méthodes de mutation contrôlée
  setUser(user: User) {
    this.userSubject.next(user);
  }
  
  clearUser() {
    this.userSubject.next(null);
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

1. Créer au moins deux services de store (Astronautes et Missions)
2. Connecter ces stores aux composants existants
3. Implémenter les opérations CRUD complètes dans chaque store
4. Créer au moins une vue combinant des données de plusieurs stores
5. Développer un système simple de débogage pour visualiser les changements d'état

Cette implémentation de gestion d'état permettra d'améliorer considérablement la cohérence des données dans le système Orion, de simplifier les composants et de faciliter les futures évolutions de l'application.