# Mission 10️⃣ : Optimisation des Performances

## Contexte
La station spatiale Orion gère des écrans de contrôle complexes affichant de grandes quantités de données en temps réel. Ces interfaces sont devenues lentes et peu réactives, notamment lors de l'affichage des graphiques de télémétrie et des listes de capteurs. Cette lenteur est due à une détection de changements inefficace, qui provoque des mises à jour inutiles du DOM. Votre mission consiste à optimiser ces performances en utilisant des stratégies avancées de détection de changements dans Angular.

## Objectif général
Optimiser les performances de l'interface utilisateur en implémentant la stratégie OnPush de détection de changements et en restructurant les composants pour éviter les pièges courants de cette approche.

## État initial
Le système actuel présente plusieurs problèmes :
- Utilisation exclusive de la stratégie Default de détection de changements
- Interfaces qui ralentissent avec l'augmentation des données
- Composants qui sont vérifiés et rendus trop fréquemment
- Mutations d'objets qui causent des bugs avec OnPush

## Cycle de détection de changements

![Cycle de détection de changements](https://raw.githubusercontent.com/votre-repo/codequest/main/assets/change-detection-cycle.png)

1. **Zone.js détecte un changement** (événement asynchrone)
2. **Angular vérifie les bindings** (@Input, {{ expression }})
3. **Le composant parent est vérifié**
4. **Les composants enfants sont vérifiés**
5. **Le DOM est mis à jour si nécessaire**

## Concepts couverts
- Fonctionnement de la détection de changements dans Angular
- Stratégies de détection : Default vs OnPush
- Immutabilité des données et son importance
- Optimisation des performances avec OnPush
- Pattern de composants "intelligents" et "présentationnels"

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Comprendre et implémenter la stratégie OnPush sur des composants simples.

**Tâches**:
1. Identifier les composants "feuilles" sans enfants qui peuvent être optimisés:
   - Composant `SensorCardComponent` qui affiche les données d'un capteur
   - Composant `StatusIndicatorComponent` qui montre l'état d'un système
2. Appliquer ChangeDetectionStrategy.OnPush à ces composants
3. Modifier le passage des données pour respecter les principes d'immutabilité:
   - S'assurer que les objets passés aux @Input sont remplacés et non mutés
   - Utiliser des fonctions "pure" dans les templates
4. Ajouter des logs pour visualiser quand les composants sont vérifiés

**Compétences acquises**:
- Compréhension du fonctionnement de la détection de changements
- Application de la stratégie OnPush
- Principes d'immutabilité dans Angular
- Déboguer la détection de changements

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Implémenter OnPush sur des composants avec données réactives et résoudre les problèmes courants.

**Tâches**:
1. Optimiser le composant `DashboardComponent` qui contient plusieurs composants enfants:
   - Appliquer OnPush à ce composant et à ses enfants
   - Transformer les données imperatives en flux Observable
   - Utiliser le pipe async dans les templates
   - Implémenter trackBy pour les listes
2. Résoudre les pièges courants:
   - Corriger les problèmes de données mutées
   - Transformer les valeurs en Observables lorsque nécessaire
   - Utiliser des opérateurs comme distinctUntilChanged
3. Créer un service de performance pour mesurer les gains:
   - Compter le nombre de cycles de détection
   - Mesurer le temps de rendu

**Compétences acquises**:
- Optimisation des composants hiérarchiques
- Récodequest de problèmes avec OnPush
- Utilisation appropriée des Observables avec OnPush
- Mesure des performances

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Mettre en place une architecture de composants optimisée pour les performances avec des techniques avancées.

**Tâches**:
1. Restructurer l'application avec un pattern "Conteneur/Présentation":
   - Composants "intelligents" (conteneurs) qui gèrent l'état et les données
   - Composants "présentationnels" (pure) qui reçoivent des données immuables
2. Implémenter des techniques avancées d'optimisation:
   - Utiliser changeDetectorRef.markForCheck() et detectChanges() de manière stratégique
   - Créer un pipe pure personnalisé pour les transformations coûteuses
   - Implémenter runOutsideAngular pour les opérations fréquentes sans impact UI
3. Optimiser le graphique de télémétrie complexe:
   - Isoler le rendu du graphique de la logique métier
   - Appliquer des techniques de détection manuelle
   - Utiliser Web Workers pour les calculs complexes

**Compétences acquises**:
- Architecture avancée pour les performances
- Techniques manuelles de détection de changements
- Stratégies d'isolation des opérations coûteuses
- Optimisation avancée des composants complexes

## Exemples de code

### Application de OnPush et immutabilité

```typescript
// Avant: Composant avec détection par défaut
@Component({
  selector: 'app-sensor-card',
  template: `
    <div class="sensor-card">
      <h3>{{ sensor.name }}</h3>
      <div class="value">{{ sensor.value }} {{ sensor.unit }}</div>
      <div class="status" [class]="sensor.status">{{ sensor.status }}</div>
    </div>
  `
})
export class SensorCardComponent {
  @Input() sensor!: Sensor;
}

// Après: Composant optimisé avec OnPush
@Component({
  selector: 'app-sensor-card',
  template: `
    <div class="sensor-card">
      <h3>{{ sensor.name }}</h3>
      <div class="value">{{ sensor.value }} {{ sensor.unit }}</div>
      <div class="status" [class]="sensor.status">{{ sensor.status }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorCardComponent {
  @Input() sensor!: Sensor;
  
  // Pour déboguer quand le composant est vérifié
  ngOnChanges(changes: SimpleChanges) {
    console.log('SensorCard inputs changed:', changes);
  }
}
```

### Composant parent avec gestion correcte de l'immutabilité

```typescript
// sensors-list.component.ts
@Component({
  selector: 'app-sensors-list',
  template: `
    <div class="sensors-container">
      <h2>Capteurs actifs</h2>
      <div class="sensors-grid">
        @for (sensor of sensors; track trackBySensorId) {
          <app-sensor-card [sensor]="sensor"></app-sensor-card>
        }
      </div>
      <button (click)="refreshSensors()">Rafraîchir</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorsListComponent {
  @Input() sensors: Sensor[] = [];
  
  constructor(private sensorService: SensorService) {}
  
  // Fonction trackBy pour optimiser les listes
  trackBySensorId(index: number, sensor: Sensor): string {
    return sensor.id;
  }
  
  refreshSensors(): void {
    this.sensorService.getSensors().subscribe(sensors => {
      // Remplacement complet de la référence (immutabilité)
      this.sensors = [...sensors];
    });
  }
  
  // MAUVAISE PRATIQUE - Ne pas faire ça avec OnPush:
  updateSensorValue(id: string, newValue: number): void {
    // ❌ Mutation de l'objet - OnPush ne détectera pas ce changement
    const sensor = this.sensors.find(s => s.id === id);
    if (sensor) {
      sensor.value = newValue; // Mutation!
    }
  }
  
  // BONNE PRATIQUE avec OnPush:
  updateSensorValueCorrect(id: string, newValue: number): void {
    // ✅ Création d'un nouveau tableau avec un nouvel objet
    this.sensors = this.sensors.map(sensor => 
      sensor.id === id 
        ? { ...sensor, value: newValue } // Nouvel objet
        : sensor
    );
  }
}
```

### Utilisation des Observables avec OnPush

```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h1>Centre de contrôle</h1>
      
      @if (sensors$ | async; as sensors) {
        <app-sensors-list [sensors]="sensors"></app-sensors-list>
      } @else {
        <div class="loading">Chargement des capteurs...</div>
      }
      
      @if (systemStatus$ | async; as status) {
        <app-system-status [status]="status"></app-system-status>
      }
      
      <div class="telemetry-section">
        <h2>Télémétrie en temps réel</h2>
        <app-telemetry-chart [data]="telemetryData$ | async"></app-telemetry-chart>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  // Données réactives avec Observables
  sensors$ = this.sensorService.getSensors().pipe(
    shareReplay(1) // Partager la réponse entre plusieurs consommateurs
  );
  
  systemStatus$ = this.statusService.getSystemStatus().pipe(
    distinctUntilChanged(), // Éviter les émissions redondantes
    shareReplay(1)
  );
  
  telemetryData$ = interval(5000).pipe( // Mise à jour toutes les 5 secondes
    switchMap(() => this.telemetryService.getLatestData()),
    shareReplay(1)
  );
  
  constructor(
    private sensorService: SensorService,
    private statusService: StatusService,
    private telemetryService: TelemetryService
  ) {}
  
  ngOnInit(): void {
    // Rien à faire ici - tout est réactif!
  }
}
```

### Pattern Conteneur/Présentation

```typescript
// COMPOSANT CONTENEUR (intelligent)
@Component({
  selector: 'app-mission-monitor',
  template: `
    <div class="mission-container">
      <h1>Moniteur de mission: {{ missionName$ | async }}</h1>
      
      <!-- Composant présentationnel -->
      <app-mission-status 
        [status]="missionStatus$ | async"
        [crew]="crewMembers$ | async"
        [objectives]="objectives$ | async"
        (objectiveCompleted)="markObjectiveComplete($event)">
      </app-mission-status>
    </div>
  `,
  // Peut utiliser Default car il gère surtout la logique
  changeDetection: ChangeDetectionStrategy.Default
})
export class MissionMonitorComponent {
  private missionService = inject(MissionService);
  private route = inject(ActivatedRoute);
  
  // Obtenir l'ID depuis l'URL et charger les données
  private missionId$ = this.route.paramMap.pipe(
    map(params => params.get('id') || '')
  );
  
  // Flux dérivés pour les données
  missionName$ = this.missionId$.pipe(
    switchMap(id => this.missionService.getMissionName(id))
  );
  
  missionStatus$ = this.missionId$.pipe(
    switchMap(id => this.missionService.getMissionStatus(id))
  );
  
  crewMembers$ = this.missionId$.pipe(
    switchMap(id => this.missionService.getCrewMembers(id))
  );
  
  objectives$ = this.missionId$.pipe(
    switchMap(id => this.missionService.getMissionObjectives(id))
  );
  
  // Méthode appelée par l'événement du composant enfant
  markObjectiveComplete(objectiveId: string): void {
    this.missionId$.pipe(
      take(1), // Prendre seulement la valeur actuelle
      switchMap(missionId => 
        this.missionService.completeObjective(missionId, objectiveId)
      )
    ).subscribe();
  }
}

// COMPOSANT PRÉSENTATIONNEL (pure)
@Component({
  selector: 'app-mission-status',
  template: `
    <div class="mission-status" [class]="status?.level || 'normal'">
      <div class="status-indicator">
        <h3>État de la mission: {{ status?.label || 'Inconnu' }}</h3>
        <span class="timestamp">Mis à jour: {{ status?.timestamp | date:'HH:mm:ss' }}</span>
      </div>
      
      <div class="crew-section">
        <h3>Équipage</h3>
        <ul class="crew-list">
          @for (member of crew; track member.id) {
            <li [class.mission-lead]="member.isLead">
              {{ member.name }} - {{ member.role }}
            </li>
          } @empty {
            <li>Aucun membre d'équipage assigné</li>
          }
        </ul>
      </div>
      
      <div class="objectives-section">
        <h3>Objectifs</h3>
        <ul class="objectives-list">
          @for (objective of objectives; track objective.id) {
            <li [class.completed]="objective.completed">
              {{ objective.description }}
              @if (!objective.completed) {
                <button (click)="completeObjective(objective.id)">
                  Marquer comme terminé
                </button>
              }
            </li>
          } @empty {
            <li>Aucun objectif défini</li>
          }
        </ul>
      </div>
    </div>
  `,
  // Utilisez OnPush pour ce composant présentationnel
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionStatusComponent {
  @Input() status: MissionStatus | null = null;
  @Input() crew: CrewMember[] = [];
  @Input() objectives: MissionObjective[] = [];
  
  @Output() objectiveCompleted = new EventEmitter<string>();
  
  completeObjective(objectiveId: string): void {
    this.objectiveCompleted.emit(objectiveId);
  }
}
```

### Optimisations avancées avec NgZone et ChangeDetectorRef

```typescript
// telemetry-chart.component.ts
@Component({
  selector: 'app-telemetry-chart',
  template: `
    <div class="chart-container" #chartContainer></div>
    <div class="chart-controls">
      <button (click)="refreshData()">Actualiser</button>
      <div class="last-update">
        Dernière mise à jour: {{ lastUpdateTime | date:'HH:mm:ss' }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelemetryChartComponent implements OnInit, OnDestroy {
  @Input() set data(value: TelemetryData[] | null) {
    if (value) {
      // Mise à jour manuelle du graphique quand les données changent
      this._data = value;
      this.updateChart();
      this.lastUpdateTime = new Date();
      // Informer Angular que quelque chose a changé
      this.cdr.markForCheck();
    }
  }
  
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  
  private _data: TelemetryData[] = [];
  private chart: any;
  private updateInterval: any;
  lastUpdateTime = new Date();
  
  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private telemetryService: TelemetryService
  ) {}
  
  ngOnInit(): void {
    // Initialisation du graphique
    this.zone.runOutsideAngular(() => {
      // Créer le graphique en dehors de la zone Angular
      // pour éviter les cycles de détection inutiles
      this.initChart();
      
      // Mettre à jour le graphique toutes les secondes sans déclencher de détection
      this.updateInterval = setInterval(() => {
        this.updateChartAnimation();
      }, 1000);
    });
  }
  
  ngOnDestroy(): void {
    // Nettoyage
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }
  
  private initChart(): void {
    if (!this.chartContainer) return;
    
    // Initialisation du graphique (d3.js, Chart.js, etc.)
    this.chart = /* initialisation du graphique */;
    
    // Ajouter les données initiales
    this.updateChart();
  }
  
  private updateChart(): void {
    if (!this.chart || !this._data) return;
    
    // Mise à jour du graphique avec les nouvelles données
    // ...
  }
  
  private updateChartAnimation(): void {
    // Mise à jour des animations ou transitions
    // sans changer les données principales
    if (this.chart) {
      // Mise à jour uniquement visuelle
    }
  }
  
  refreshData(): void {
    // Cette méthode est appelée depuis le template,
    // donc elle s'exécute dans la zone Angular
    this.telemetryService.getLatestData().subscribe(data => {
      this.data = data;
    });
  }
}
```

### Pipe Pure pour les opérations coûteuses

```typescript
// filter-sensors.pipe.ts
@Pipe({
  name: 'filterSensors',
  pure: true, // Pure par défaut, mais explicite ici pour clarté
  standalone: true
})
export class FilterSensorsPipe implements PipeTransform {
  transform(sensors: Sensor[], status?: string, threshold?: number): Sensor[] {
    console.log('FilterSensorsPipe exécuté'); // Monitorer les exécutions
    
    if (!sensors) return [];
    
    let result = [...sensors];
    
    if (status) {
      result = result.filter(sensor => sensor.status === status);
    }
    
    if (threshold !== undefined) {
      result = result.filter(sensor => sensor.value > threshold);
    }
    
    return result;
  }
}

// Utilisation dans un composant
@Component({
  selector: 'app-filtered-sensors',
  template: `
    <div class="filters">
      <select [formControl]="statusFilter">
        <option value="">Tous les statuts</option>
        <option value="normal">Normal</option>
        <option value="warning">Avertissement</option>
        <option value="critical">Critique</option>
      </select>
      
      <input type="number" [formControl]="thresholdFilter" placeholder="Seuil min.">
    </div>
    
    <div class="sensors-list">
      @for (sensor of sensors | filterSensors:status:threshold; track sensor.id) {
        <app-sensor-card [sensor]="sensor"></app-sensor-card>
      } @empty {
        <div class="no-results">Aucun capteur ne correspond aux critères</div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilteredSensorsComponent {
  @Input() sensors: Sensor[] = [];
  
  statusFilter = new FormControl('');
  thresholdFilter = new FormControl<number | null>(null);
  
  get status(): string {
    return this.statusFilter.value || '';
  }
  
  get threshold(): number | undefined {
    return this.thresholdFilter.value ?? undefined;
  }
}
```

## Comparaison des stratégies de détection de changements

| Stratégie | Comportement |
|-----------|-------------|
| `Default` | Angular vérifie toujours le composant ET ses enfants |
| `OnPush` | Angular ne vérifie le composant que si : <br> - un `@Input()` change <br> - un `Event` vient de lui <br> - un `Observable` émet via le pipe async |

## Problèmes courants avec OnPush et leurs codequests

| Problème | Cause | Solution |
|----------|-------|----------|
| La vue ne se met pas à jour | Objet muté | Utiliser un objet immuable |
| Comportement non réactif | Pas d'Observable | Exposer des Observable au lieu de valeurs |
| L'input a changé mais pas détecté | @Input() non remplacé | Fournir une nouvelle référence (ex: next({ ...value })) |

## Bonnes pratiques pour OnPush

- ✅ Utiliser des Observables avec le pipe async
- ✅ Manipuler des objets de manière immuable
- ✅ Utiliser markForCheck() plutôt que detectChanges() si possible
- ✅ Isoler les opérations coûteuses avec runOutsideAngular()
- ✅ Créer des pipes purs pour les transformations complexes
- ✅ Utiliser trackBy pour optimiser les listes

## Livrables attendus

Pour cette mission, vous devrez:

1. Appliquer ChangeDetectionStrategy.OnPush à au moins 5 composants clés
2. Restructurer le code pour maintenir l'immutabilité des données
3. Optimiser les composants avec des Observables et le pipe async
4. Mettre en place au moins un exemple de chaque technique avancée:
   - runOutsideAngular()
   - markForCheck()/detectChanges()
   - trackBy pour les listes
   - Pipe pur personnalisé

Ces optimisations permettront d'améliorer significativement les performances des interfaces de la station Orion, particulièrement pour les écrans qui affichent de grandes quantités de données en temps réel.