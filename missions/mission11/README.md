# Mission 11️⃣ : Contrôle Nouvelle Génération

## Contexte
Les ingénieurs du centre de contrôle ont développé une nouvelle technologie de réactivité appelée "Signals" qui pourrait révolutionner les systèmes de contrôle de la station spatiale Orion. Cette technologie promet une meilleure performance, une réactivité plus ciblée et une réduction de la consommation de ressources. Votre mission est de moderniser des parties critiques du système en implémentant cette approche Signal pour les contrôles en temps réel et les tableaux de bord.

## Objectif général
Migrer des composants clés du système Orion vers l'architecture Signals d'Angular 17, en remplaçant les approches traditionnelles basées sur RxJS et la détection de changements globale, pour obtenir une interface plus réactive et performante.

## État initial
Le système actuel utilise :
- Des Observables pour la gestion d'état et la réactivité
- Le pipe async dans les templates
- La détection de changements traditionnelle (Zone.js)
- Des BehaviorSubjects pour l'état local

## Concepts couverts
- Les fondamentaux des Signals (signal, computed, effect)
- Différences entre Signal et Observable
- Intégration des Signals dans l'architecture existante
- Pattern d'encapsulation (ReadableSignal/WritableSignal)
- Optimisation de la détection de changement avec Signals

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Implémenter des Signals de base dans des composants simples.

**Tâches**:
1. Convertir l'état local du composant `ControlPanelComponent` :
   - Remplacer les variables d'état par des signals
   - Utiliser des getters/setters pour faciliter la transition
   - Mettre à jour le template pour lire les valeurs des signals
2. Créer des computed values pour les données dérivées :
   - Calculer automatiquement des moyennes, totaux, états dérivés
   - Remplacer les méthodes de calcul par des computed
3. Ajouter des effets simples pour les actions collatérales :
   - Logger les changements importants
   - Déclencher des notifications
4. Comparer les performances avant/après

**Compétences acquises**:
- Création et utilisation de signals de base
- Compréhension des computed values
- Utilisation des effects pour les side effects
- Lecture directe de signals dans les templates

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Créer un service de gestion d'état basé sur les Signals et l'intégrer aux composants existants.

**Tâches**:
1. Développer un `ResourceMonitorService` basé sur Signals :
   - Créer des WritableSignals privés pour l'état interne
   - Exposer des ReadableSignals publics
   - Implémenter des méthodes pour mettre à jour l'état
   - Fournir des computed values pour les données dérivées
2. Intégrer ce service dans plusieurs composants :
   - Remplacer les Observables par des Signals où approprié
   - Conserver l'interopérabilité avec les parties basées sur RxJS
   - Optimiser les templates pour les Signals
3. Migrer une fonctionnalité dynamique :
   - Créer un tableau de bord de ressources avec mises à jour en temps réel
   - Implémenter des filtres réactifs
   - Utiliser le pattern ReadableSignal pour l'encapsulation

**Compétences acquises**:
- Création de services basés sur Signals
- Pattern d'encapsulation ReadableSignal/WritableSignal
- Interopérabilité Signal/Observable
- Architecture hybride pendant la migration

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Mettre en place une architecture avancée combinant Signals et les dernières fonctionnalités d'Angular.

**Tâches**:
1. Créer un `SignalStore` générique pour la gestion d'état :
   - Implémenter un pattern similaire à NgRx mais basé sur Signals
   - Créer des sélecteurs basés sur computed
   - Supporter les actions typées et les réductions d'état
   - Ajouter des capacités de débogage et journalisation
2. Optimiser les performances avec Signals et nouvelles fonctionnalités :
   - Combiner Signals avec @if, @for, @switch pour des templates optimisés
   - Utiliser @defer pour le chargement à la demande de parties complexes
   - Expérimenter avec provideExperimentalZonelessChangeDetection()
3. Créer un composant de visualisation de données complexe :
   - Graphique de télémétrie en temps réel basé sur Signals
   - Détecter et afficher les anomalies automatiquement
   - Optimiser pour des mises à jour fréquentes sans perte de performance

**Compétences acquises**:
- Architecture avancée de gestion d'état avec Signals
- Zoneless change detection
- Optimisation des performances pour les interfaces complexes
- Patterns avancés combinant Signals et les fonctionnalités d'Angular 17

## Exemples de code

### Signals de base

```typescript
// control-panel.component.ts - Avant
@Component({
  selector: 'app-control-panel',
  template: `
    <div class="panel">
      <h2>Panneau de contrôle système</h2>
      <div class="temperature">
        Température: {{ temperature }}°C
        <button (click)="increaseTemperature()">+</button>
        <button (click)="decreaseTemperature()">-</button>
      </div>
      <div class="status">
        Statut: {{ systemStatus }}
        <button (click)="toggleSystem()">{{ isSystemActive ? 'Désactiver' : 'Activer' }}</button>
      </div>
      <div class="power">
        Puissance: {{ powerLevel }}%
        <input type="range" min="0" max="100" [value]="powerLevel" (input)="setPowerLevel($event)">
      </div>
    </div>
  `
})
export class ControlPanelComponent {
  temperature = 22;
  isSystemActive = true;
  powerLevel = 50;
  
  get systemStatus(): string {
    return this.isSystemActive ? 'Actif' : 'Inactif';
  }
  
  increaseTemperature(): void {
    this.temperature++;
  }
  
  decreaseTemperature(): void {
    this.temperature--;
  }
  
  toggleSystem(): void {
    this.isSystemActive = !this.isSystemActive;
  }
  
  setPowerLevel(event: Event): void {
    this.powerLevel = +(event.target as HTMLInputElement).value;
  }
}

// control-panel.component.ts - Après (avec Signals)
@Component({
  selector: 'app-control-panel',
  template: `
    <div class="panel">
      <h2>Panneau de contrôle système</h2>
      <div class="temperature">
        Température: {{ temperature() }}°C
        <button (click)="increaseTemperature()">+</button>
        <button (click)="decreaseTemperature()">-</button>
      </div>
      <div class="status">
        Statut: {{ systemStatus() }}
        <button (click)="toggleSystem()">{{ isSystemActive() ? 'Désactiver' : 'Activer' }}</button>
      </div>
      <div class="power">
        Puissance: {{ powerLevel() }}%
        <input type="range" min="0" max="100" [value]="powerLevel()" (input)="setPowerLevel($event)">
      </div>
      <div class="efficiency">
        Efficacité: {{ efficiency() }}%
      </div>
    </div>
  `
})
export class ControlPanelComponent {
  // Signals de base pour l'état
  temperature = signal(22);
  isSystemActive = signal(true);
  powerLevel = signal(50);
  
  // Computed value dérivée
  systemStatus = computed(() => 
    this.isSystemActive() ? 'Actif' : 'Inactif'
  );
  
  // Computed plus complexe
  efficiency = computed(() => {
    const power = this.powerLevel();
    const temp = this.temperature();
    
    // Formule d'efficacité fictive
    return Math.round(100 - (Math.abs(temp - 22) * 2) - (power > 80 ? (power - 80) / 2 : 0));
  });
  
  constructor() {
    // Effect pour les actions collatérales
    effect(() => {
      console.log(`Température modifiée: ${this.temperature()}°C`);
      
      // Alerte si température critique
      if (this.temperature() > 30 || this.temperature() < 10) {
        console.warn(`Température critique: ${this.temperature()}°C`);
      }
    });
  }
  
  increaseTemperature(): void {
    this.temperature.update(t => t + 1);
  }
  
  decreaseTemperature(): void {
    this.temperature.update(t => t - 1);
  }
  
  toggleSystem(): void {
    this.isSystemActive.update(active => !active);
  }
  
  setPowerLevel(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.powerLevel.set(value);
  }
}
```

### Service de gestion d'état avec Signals

```typescript
// resource.model.ts
export interface Resource {
  id: string;
  name: string;
  currentLevel: number;
  criticalThreshold: number;
  maxCapacity: number;
  unit: string;
}

// resource-monitor.service.ts
@Injectable({
  providedIn: 'root'
})
export class ResourceMonitorService {
  // État privé avec WritableSignal
  private _resources = signal<Resource[]>([]);
  
  // Exposition publique en lecture seule
  readonly resources: ReadableSignal<Resource[]> = this._resources;
  
  // Computed values dérivées
  readonly criticalResources = computed(() => 
    this._resources().filter(r => r.currentLevel < r.criticalThreshold)
  );
  
  readonly resourceCount = computed(() => this._resources().length);
  
  readonly averageResourceLevel = computed(() => {
    const resources = this._resources();
    if (resources.length === 0) return 0;
    
    const sum = resources.reduce((acc, r) => 
      acc + (r.currentLevel / r.maxCapacity) * 100, 0
    );
    return Math.round(sum / resources.length);
  });
  
  constructor(private http: HttpClient) {
    // Initialiser les ressources au démarrage
    this.loadResources();
    
    // Effect pour logger les ressources critiques
    effect(() => {
      const critical = this.criticalResources();
      if (critical.length > 0) {
        console.warn(`Ressources critiques: ${critical.length}`);
        console.warn(critical.map(r => r.name).join(', '));
      }
    });
  }
  
  // Méthodes de mutation
  updateResourceLevel(id: string, newLevel: number): void {
    this._resources.update(resources => 
      resources.map(resource => 
        resource.id === id 
          ? { ...resource, currentLevel: newLevel } 
          : resource
      )
    );
  }
  
  addResource(resource: Resource): void {
    this._resources.update(resources => [...resources, resource]);
  }
  
  removeResource(id: string): void {
    this._resources.update(resources => 
      resources.filter(resource => resource.id !== id)
    );
  }
  
  // Charger les ressources depuis l'API
  loadResources(): void {
    this.http.get<Resource[]>('/api/resources').subscribe(resources => {
      this._resources.set(resources);
    });
  }
  
  // Conversion Signal -> Observable pour compatibilité
  getResourcesAsObservable(): Observable<Resource[]> {
    return toObservable(this.resources);
  }
  
  // Conversion Observable -> Signal
  setResourcesFromObservable(resources$: Observable<Resource[]>): void {
    resources$.subscribe(resources => {
      this._resources.set(resources);
    });
  }
}
```

### Utilisation du service dans un composant

```typescript
// resource-dashboard.component.ts
@Component({
  selector: 'app-resource-dashboard',
  template: `
    <div class="dashboard">
      <h2>Tableau de bord des ressources</h2>
      
      <div class="summary">
        <div class="card">
          <h3>Ressources totales</h3>
          <div class="value">{{ resourceService.resourceCount() }}</div>
        </div>
        <div class="card">
          <h3>Niveau moyen</h3>
          <div class="value">{{ resourceService.averageResourceLevel() }}%</div>
        </div>
        <div class="card critical">
          <h3>Ressources critiques</h3>
          <div class="value">{{ resourceService.criticalResources().length }}</div>
        </div>
      </div>
      
      <div class="filters">
        <input 
          type="text" 
          placeholder="Filtrer par nom" 
          [value]="nameFilter()" 
          (input)="updateNameFilter($event)"
        >
        <select 
          [value]="statusFilter()" 
          (change)="updateStatusFilter($event)"
        >
          <option value="all">Tous les statuts</option>
          <option value="normal">Normal</option>
          <option value="critical">Critique</option>
        </select>
      </div>
      
      <div class="resources-list">
        @for (resource of filteredResources(); track resource.id) {
          <app-resource-card 
            [resource]="resource"
            (levelChanged)="updateResourceLevel($event.id, $event.level)"
          ></app-resource-card>
        } @empty {
          <div class="empty-state">Aucune ressource trouvée</div>
        }
      </div>
    </div>
  `
})
export class ResourceDashboardComponent {
  resourceService = inject(ResourceMonitorService);
  
  // Filtres
  nameFilter = signal('');
  statusFilter = signal('all');
  
  // Computed pour les ressources filtrées
  filteredResources = computed(() => {
    const resources = this.resourceService.resources();
    const name = this.nameFilter().toLowerCase();
    const status = this.statusFilter();
    
    return resources.filter(resource => {
      const nameMatch = name === '' || resource.name.toLowerCase().includes(name);
      const statusMatch = 
        status === 'all' || 
        (status === 'critical' && resource.currentLevel < resource.criticalThreshold) ||
        (status === 'normal' && resource.currentLevel >= resource.criticalThreshold);
      
      return nameMatch && statusMatch;
    });
  });
  
  // Gestionnaires d'événements
  updateNameFilter(event: Event): void {
    this.nameFilter.set((event.target as HTMLInputElement).value);
  }
  
  updateStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }
  
  updateResourceLevel(id: string, level: number): void {
    this.resourceService.updateResourceLevel(id, level);
  }
}
```

### SignalStore générique avancé

```typescript
// signal-store.ts
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export class SignalStore<T> {
  private _state: WritableSignal<T>;
  private _actions = new Subject<Action>();
  
  // État public en lecture seule
  readonly state: ReadableSignal<T>;
  
  // Observable des actions pour le débogage
  readonly actions$ = this._actions.asObservable();
  
  constructor(
    initialState: T,
    private reducer: (state: T, action: Action) => T
  ) {
    this._state = signal(initialState);
    this.state = this._state;
    
    // Effect pour traiter les actions
    this._actions.subscribe(action => {
      console.log('[Store] Action:', action.type, action.payload);
      
      const newState = this.reducer(this._state(), action);
      this._state.set(newState);
      
      console.log('[Store] New state:', newState);
    });
  }
  
  // Méthode pour dispatcher une action
  dispatch(action: Action): void {
    this._actions.next(action);
  }
  
  // Créer un sélecteur (computed)
  select<R>(projector: (state: T) => R): Signal<R> {
    return computed(() => projector(this._state()));
  }
}

// Exemple d'utilisation
// mission-store.ts
export interface MissionState {
  missions: Mission[];
  selectedMissionId: string | null;
  loading: boolean;
  error: string | null;
}

export const initialMissionState: MissionState = {
  missions: [],
  selectedMissionId: null,
  loading: false,
  error: null
};

// Actions
export const LOAD_MISSIONS = '[Mission] Load Missions';
export const MISSIONS_LOADED = '[Mission] Missions Loaded';
export const MISSION_SELECTED = '[Mission] Mission Selected';
export const MISSION_ERROR = '[Mission] Error';

// Reducer
export function missionReducer(state: MissionState, action: Action): MissionState {
  switch (action.type) {
    case LOAD_MISSIONS:
      return { ...state, loading: true, error: null };
    
    case MISSIONS_LOADED:
      return { 
        ...state, 
        missions: action.payload,
        loading: false,
        error: null
      };
    
    case MISSION_SELECTED:
      return { ...state, selectedMissionId: action.payload };
    
    case MISSION_ERROR:
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
}

// Service
@Injectable({
  providedIn: 'root'
})
export class MissionStoreService {
  private store = new SignalStore<MissionState>(initialMissionState, missionReducer);
  private http = inject(HttpClient);
  
  // Sélecteurs
  readonly missions = this.store.select(state => state.missions);
  readonly selectedMissionId = this.store.select(state => state.selectedMissionId);
  readonly loading = this.store.select(state => state.loading);
  readonly error = this.store.select(state => state.error);
  
  // Computed dérivé
  readonly selectedMission = computed(() => {
    const id = this.selectedMissionId();
    return id ? this.missions().find(m => m.id === id) || null : null;
  });
  
  // Actions
  loadMissions(): void {
    this.store.dispatch({ type: LOAD_MISSIONS });
    
    this.http.get<Mission[]>('/api/missions').subscribe({
      next: (missions) => {
        this.store.dispatch({ type: MISSIONS_LOADED, payload: missions });
      },
      error: (err) => {
        this.store.dispatch({ type: MISSION_ERROR, payload: err.message });
      }
    });
  }
  
  selectMission(id: string): void {
    this.store.dispatch({ type: MISSION_SELECTED, payload: id });
  }
}
```

### Optimisation avec Zoneless Change Detection

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // autres providers...
  ]
}).catch(err => console.error(err));
```

### Combinaison de Signals avec @defer

```typescript
// telemetry-dashboard.component.ts
@Component({
  selector: 'app-telemetry-dashboard',
  template: `
    <div class="dashboard">
      <h2>Télémétrie en temps réel</h2>
      
      <div class="system-status">
        Statut général: {{ systemStatus() }}
      </div>
      
      <div class="telemetry-overview">
        @for (metric of coreMetrics(); track metric.id) {
          <div class="metric-card">
            <h3>{{ metric.name }}</h3>
            <div class="value">{{ metric.value }} {{ metric.unit }}</div>
          </div>
        }
      </div>
      
      @defer {
        <app-telemetry-chart [data]="detailedTelemetry()"></app-telemetry-chart>
      } @loading {
        <div class="chart-loading">Chargement du graphique avancé...</div>
      } @placeholder {
        <div class="chart-placeholder">
          Le graphique détaillé se chargera lors du défilement
        </div>
      }
      
      @if (anomalies().length > 0) {
        <div class="anomalies-section">
          <h3>Anomalies détectées</h3>
          <ul class="anomalies-list">
            @for (anomaly of anomalies(); track anomaly.id) {
              <li class="anomaly-item">
                <span class="time">{{ anomaly.timestamp | date:'HH:mm:ss' }}</span>
                <span class="system">{{ anomaly.system }}</span>
                <span class="message">{{ anomaly.message }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `
})
export class TelemetryDashboardComponent {
  // Signals pour l'état
  private telemetryService = inject(TelemetryService);
  
  systemStatus = computed(() => {
    const anomalyCount = this.anomalies().length;
    if (anomalyCount > 5) return 'Critique';
    if (anomalyCount > 0) return 'Avertissement';
    return 'Normal';
  });
  
  coreMetrics = this.telemetryService.coreMetrics;
  detailedTelemetry = this.telemetryService.detailedTelemetry;
  anomalies = this.telemetryService.anomalies;
  
  constructor() {
    // Refresh telemetry in background
    effect(() => {
      const intervalId = setInterval(() => {
        this.telemetryService.refreshTelemetry();
      }, 5000);
      
      return () => clearInterval(intervalId);
    });
  }
}
```

## Signal vs Observable

| Signal | Observable |
|--------|------------|
| Lecture synchrone | Lecture asynchrone |
| Réactivité native Angular | Réactivité via async pipe |
| Valeur actuelle disponible directement | Valeur actuelle non disponible directement (sauf BehaviorSubject) |
| Idéal pour état local UI | Idéal pour API / flux de données |
| Simple d'utilisation | Parfois plus verbeux |

## Avantages des Signals

- ✅ **Performances améliorées** - Détection de changements plus ciblée
- ✅ **Code plus concis** - Moins de boilerplate que les Observables
- ✅ **Dépendances traçables** - Relations explicites entre données
- ✅ **Synchrone** - Valeurs disponibles immédiatement
- ✅ **Intégration native** - Parfaite intégration avec Angular
- ✅ **Zoneless possible** - Élimination possible de Zone.js pour des performances optimales

## Cas d'utilisation recommandés

| Use Case | Recommandation |
|----------|----------------|
| État local du composant | ✅ Signal |
| Propriétés dérivées | ✅ computed |
| Side effects (logs, analytics) | ✅ effect |
| Requêtes HTTP | ⚠️ Observable (ou conversion) |
| État global partagé | ✅ Signal Store |
| Filtrage réactif | ✅ computed |

## Bonnes pratiques

- ✅ Utilisez `signal()` pour l'état local dans un composant
- ✅ Privilégiez `computed()` pour les dérivations pures
- ✅ Réservez `effect()` uniquement pour des side effects (logs, analytics, appels API)
- ✅ Exposez `ReadableSignal` pour l'API publique
- ✅ Combinez avec `@if`, `@switch`, `@defer` pour des templates optimisés
- ⚠️ Évitez les effects qui modifient d'autres signals

## Livrables attendus

Pour cette mission, vous devrez:

1. Convertir au moins deux composants pour utiliser des signals au lieu de variables d'état
2. Créer un service basé sur signals pour une fonctionnalité centrale
3. Implémenter des computed values pour les données dérivées
4. Utiliser des effects pour les actions collatérales
5. Optimiser au moins un composant avec @defer et signals
6. Explorer l'option Zoneless pour au moins une partie de l'application (expérimental)

Cette implémentation des Signals permettra d'améliorer les performances de l'interface utilisateur d'Orion, de réduire la consommation de ressources et de préparer le système pour les futures évolutions d'Angular.