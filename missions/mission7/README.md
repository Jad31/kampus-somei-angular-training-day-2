# Mission 7️⃣ : Système de Capteurs en Temps Réel

## Contexte
La station spatiale Orion doit constamment surveiller des milliers de capteurs qui génèrent des flux de données en temps réel. Le système actuel de gestion des données utilise des approches impératives obsolètes qui causent des fuites mémoire et rendent difficile la coordination des flux de données multiples. Votre mission est de moderniser le système de surveillance en utilisant la programmation réactive avec RxJS et les meilleures pratiques Angular 17.

## Objectif général
Transformer le système de capteurs pour utiliser une architecture réactive basée sur RxJS, en évitant les fuites mémoire et en optimisant la gestion des flux de données asynchrones complexes.

## État initial
Le système actuel présente plusieurs problèmes :
- Utilisation de callbacks imbriqués pour les événements asynchrones
- Nombreuses souscriptions non gérées causant des fuites mémoire
- Manipulation impérative des données rendant difficile la combinaison de sources multiples
- Code verbeux avec gestion manuelle de l'état

## Concepts RxJS fondamentaux

![Fondamentaux RxJS](https://raw.githubusercontent.com/votre-repo/codequest/main/assets/rxjs-fundamentals.png)

1. **Source** : Point d'origine des données (API, événements, etc.)
2. **Pipe d'opérateurs** : Transforment les données qui circulent dans le flux
3. **Souscription** : Exécute le flux et réagit aux données émises

## Concepts couverts
- Fondamentaux RxJS et programmation réactive
- Opérateurs RxJS essentiels (map, switchMap, combineLatest, etc.)
- Gestion des souscriptions et prévention des fuites mémoire
- Patterns modernes Angular pour RxJS
- Architecture réactive pour les flux de données en temps réel

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Moderniser l'affichage des données des capteurs avec le pattern async pipe.

**Tâches**:
1. Convertir le composant `SensorDisplayComponent` pour utiliser le pattern Observable + async pipe:
   - Remplacer les souscriptions manuelles par des Observables exposés comme propriétés
   - Utiliser le pipe async dans les templates avec la nouvelle syntaxe `@if` d'Angular 17
   - Implémenter un indicateur de chargement avec le pattern async
2. Appliquer les transformations de base sur les données des capteurs:
   - Utiliser `map` pour transformer les valeurs brutes en métriques utilisables
   - Filtrer les valeurs invalides avec `filter`
   - Limiter la fréquence des mises à jour avec `debounceTime`
3. Mettre en place un système simple de rafraîchissement périodique:
   - Utiliser `interval` pour créer un flux périodique
   - Combiner avec `switchMap` pour déclencher des requêtes API

**Compétences acquises**:
- Utilisation du pattern Observable + async pipe
- Manipulation des opérateurs RxJS de base
- Prévention des fuites mémoire grâce au async pipe
- Création de flux périodiques

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Créer un tableau de bord réactif combinant plusieurs sources de données.

**Tâches**:
1. Développer un tableau de bord qui fusionne plusieurs flux de capteurs:
   - Utiliser `combineLatest` pour synchroniser les données de différents systèmes
   - Créer une recherche réactive avec `valueChanges` et `switchMap`
   - Implémenter un système de filtres interactifs avec `distinctUntilChanged`
2. Gérer les cas d'erreur et de chargement:
   - Mettre en place une gestion d'erreur avec `catchError`
   - Implémenter un mécanisme de retry automatique avec `retry` ou `retryWhen`
   - Créer des indicateurs d'état (loading, error, success) réactifs
3. Optimiser les performances:
   - Utiliser `shareReplay` pour partager les résultats entre plusieurs consommateurs
   - Implémenter `distinctUntilChanged` pour éviter les calculs redondants
   - Appliquer `debounceTime` et `throttleTime` pour limiter les requêtes API

**Compétences acquises**:
- Combinaison de flux multiples
- Gestion avancée des erreurs avec RxJS
- Techniques d'optimisation des Observables
- Création d'interfaces réactives et interactives

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Mettre en place une architecture avancée pour la surveillance en temps réel avec détection d'anomalies.

**Tâches**:
1. Créer un système de surveillance avancé avec détection d'anomalies:
   - Utiliser `window` ou `buffer` pour analyser des séquences de données
   - Implémenter des algorithmes de détection d'anomalies avec RxJS
   - Créer un système d'alertes réactif basé sur des seuils configurables
2. Mettre en place une architecture de services réactifs:
   - Développer un `SensorFacadeService` qui centralise la logique de gestion des capteurs
   - Créer des Observables dérivés pour différentes vues des données
   - Implémenter un système de cache intelligent avec invalidation
3. Optimiser pour la performance et le temps réel:
   - Utiliser `webSocket` pour les connexions en temps réel
   - Implémenter un mécanisme de mise en mémoire tampon avec `bufferTime` ou `bufferCount`
   - Créer une stratégie de reconnexion automatique avec `retryWhen` et `delayWhen`

**Compétences acquises**:
- Architecture avancée basée sur RxJS
- Techniques d'analyse de flux en temps réel
- Patterns de services réactifs
- Communication temps réel optimisée

## Exemples de code

### Affichage basique avec async pipe

```typescript
// sensor-display.component.ts
@Component({
  selector: 'app-sensor-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (sensorData$ | async; as data) {
      <div class="sensor-panel">
        <h2>{{ data.name }}</h2>
        <div class="value" [class.alert]="data.value > data.threshold">
          {{ data.value | number:'1.2-2' }} {{ data.unit }}
        </div>
        <div class="timestamp">Dernière mise à jour: {{ data.timestamp | date:'HH:mm:ss' }}</div>
      </div>
    } @else {
      <div class="loading">Chargement des données du capteur...</div>
    }
  `
})
export class SensorDisplayComponent {
  private sensorService = inject(SensorService);
  private route = inject(ActivatedRoute);
  
  // Observable qui combine l'ID du capteur de l'URL avec les données du service
  sensorData$ = this.route.paramMap.pipe(
    map(params => params.get('id') || ''),
    switchMap(id => this.sensorService.getSensorData(id)),
    map(data => ({
      ...data,
      // Traitement des données pour l'affichage
      value: this.convertValue(data.rawValue),
      timestamp: new Date()
    }))
  );
  
  private convertValue(rawValue: number): number {
    // Logique de conversion/calibration
    return rawValue * 0.1;
  }
}
```

### Tableau de bord avec plusieurs sources

```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="filters">
      <input [formControl]="searchControl" placeholder="Rechercher un capteur..." />
      <select [formControl]="systemFilter">
        <option value="">Tous les systèmes</option>
        <option value="life-support">Support de vie</option>
        <option value="propulsion">Propulsion</option>
        <option value="power">Énergie</option>
      </select>
    </div>
    
    @if (filteredSensors$ | async; as sensors) {
      <div class="sensors-grid">
        @for (sensor of sensors; track sensor.id) {
          <app-sensor-card [sensor]="sensor"></app-sensor-card>
        } @empty {
          <div class="no-results">Aucun capteur ne correspond aux critères</div>
        }
      </div>
    } @else if (loading$ | async) {
      <div class="loading-container">Chargement des capteurs...</div>
    } @else if (error$ | async; as errorMsg) {
      <div class="error-container">{{ errorMsg }}</div>
    }
    
    <div class="system-summary">
      @if (systemSummary$ | async; as summary) {
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Support de vie</span>
            <span class="value" [class.critical]="summary.lifeSupport.status === 'critical'">
              {{ summary.lifeSupport.status }}
            </span>
          </div>
          <!-- Autres systèmes... -->
        </div>
      }
    </div>
  `
})
export class DashboardComponent {
  private sensorService = inject(SensorService);
  private systemService = inject(SystemService);
  
  // Contrôles pour les filtres
  searchControl = new FormControl('');
  systemFilter = new FormControl('');
  
  // État de chargement et d'erreur
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  
  // Flux des filtres combinés
  private filters$ = combineLatest([
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ),
    this.systemFilter.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged()
    )
  ]);
  
  // Données des capteurs
  private sensors$ = this.sensorService.getAllSensors().pipe(
    tap(() => this.loading$.next(false)),
    catchError(err => {
      this.error$.next('Erreur lors du chargement des capteurs: ' + err.message);
      this.loading$.next(false);
      return EMPTY;
    }),
    shareReplay(1)
  );
  
  // Capteurs filtrés selon les critères
  filteredSensors$ = combineLatest([this.sensors$, this.filters$]).pipe(
    map(([sensors, [searchTerm, systemType]]) => 
      sensors.filter(sensor => 
        (searchTerm ? sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
        (systemType ? sensor.system === systemType : true)
      )
    )
  );
  
  // Résumé de l'état des systèmes
  systemSummary$ = this.systemService.getSystemsStatus().pipe(
    catchError(() => of({
      lifeSupport: { status: 'unknown' },
      propulsion: { status: 'unknown' },
      power: { status: 'unknown' }
    }))
  );
  
  // Rafraîchissement automatique
  private refresh$ = interval(30000).pipe(
    startWith(0),
    tap(() => this.refreshData())
  );
  
  // Souscription au rafraîchissement
  private refreshSubscription = this.refresh$.subscribe();
  
  private refreshData(): void {
    this.loading$.next(true);
    this.sensors$ = this.sensorService.getAllSensors().pipe(
      tap(() => this.loading$.next(false)),
      catchError(err => {
        this.error$.next('Erreur lors du rafraîchissement: ' + err.message);
        this.loading$.next(false);
        return EMPTY;
      }),
      shareReplay(1)
    );
  }
}
```

### Service de facade pour capteurs

```typescript
// sensor-facade.service.ts
@Injectable({
  providedIn: 'root'
})
export class SensorFacadeService {
  private apiService = inject(ApiService);
  private refreshInterval$ = new BehaviorSubject<number>(30000);
  
  // Cache des données de capteurs avec invalidation
  private sensorsCache$ = this.refreshInterval$.pipe(
    switchMap(interval => 
      interval > 0 ? timer(0, interval) : of(0)
    ),
    switchMap(() => this.apiService.getSensors()),
    shareReplay(1)
  );
  
  // Capteurs filtrés par système
  getSensorsBySystem(system: string): Observable<Sensor[]> {
    return this.sensorsCache$.pipe(
      map(sensors => sensors.filter(s => s.system === system))
    );
  }
  
  // Capteurs avec des anomalies détectées
  getAnomalousSensors(): Observable<Sensor[]> {
    return this.sensorsCache$.pipe(
      map(sensors => sensors.filter(s => s.value > s.threshold))
    );
  }
  
  // Sommaire des anomalies par système
  getAnomalySummary(): Observable<SystemAnomalySummary[]> {
    return this.sensorsCache$.pipe(
      map(sensors => {
        const systems = [...new Set(sensors.map(s => s.system))];
        return systems.map(system => {
          const systemSensors = sensors.filter(s => s.system === system);
          const anomalies = systemSensors.filter(s => s.value > s.threshold);
          return {
            system,
            totalSensors: systemSensors.length,
            anomalies: anomalies.length,
            criticalAnomalies: anomalies.filter(s => s.value > s.threshold * 1.5).length
          };
        });
      })
    );
  }
  
  // Détection d'anomalies sur un capteur spécifique
  monitorSensor(id: string): Observable<SensorWithAnomaly> {
    return this.apiService.getSensorStream(id).pipe(
      // Utiliser un buffer pour analyser les N dernières valeurs
      bufferCount(10, 1),
      map(values => {
        const currentValue = values[values.length - 1];
        const average = values.reduce((sum, curr) => sum + curr.value, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sum, curr) => sum + Math.pow(curr.value - average, 2), 0) / values.length);
        
        // Détection d'anomalie: valeur > moyenne + 2*écart-type
        const isAnomaly = currentValue.value > average + 2 * stdDev;
        
        return {
          ...currentValue,
          isAnomaly,
          anomalyScore: isAnomaly ? (currentValue.value - average) / stdDev : 0
        };
      }),
      // Ne déclencher des notifications que lorsqu'une anomalie est détectée
      distinctUntilChanged((prev, curr) => prev.isAnomaly === curr.isAnomaly)
    );
  }
  
  // Configuration de l'intervalle de rafraîchissement
  setRefreshInterval(ms: number): void {
    this.refreshInterval$.next(ms);
  }
}
```

### Connexion WebSocket en temps réel

```typescript
// websocket.service.ts
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private config = inject(ENVIRONMENT);
  
  // Création d'une connexion WebSocket avec reconnexion automatique
  createConnection<T>(path: string): Observable<T> {
    return webSocket<T>({
      url: `${this.config.wsUrl}/${path}`,
      openObserver: {
        next: () => console.log(`WebSocket connection opened: ${path}`)
      },
      closeObserver: {
        next: () => console.log(`WebSocket connection closed: ${path}`)
      }
    }).pipe(
      retry({
        delay: (error, retryCount) => {
          console.log(`WebSocket connection error (${retryCount} retries): ${error.message}`);
          // Stratégie de backoff exponentiel
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          console.log(`Reconnecting in ${delay}ms...`);
          return timer(delay);
        }
      }),
      share() // Partager la connexion entre plusieurs souscripteurs
    );
  }
  
  // Connexion spécifique pour les alertes critiques
  getCriticalAlerts(): Observable<CriticalAlert> {
    return this.createConnection<CriticalAlert>('critical-alerts');
  }
  
  // Connexion spécifique pour la télémétrie en temps réel
  getTelemetry(systemId: string): Observable<TelemetryData> {
    return this.createConnection<TelemetryData>(`telemetry/${systemId}`);
  }
}
```

### Détection d'anomalies en temps réel

```typescript
// anomaly-monitor.component.ts
@Component({
  selector: 'app-anomaly-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="anomaly-dashboard">
      <h2>Détection d'anomalies en temps réel</h2>
      
      @if (anomalies$ | async; as anomalies) {
        <div class="anomaly-list">
          @for (anomaly of anomalies; track anomaly.sensorId) {
            <div class="anomaly-card" [class.critical]="anomaly.severity === 'critical'">
              <h3>{{ anomaly.sensorName }}</h3>
              <div class="details">
                <div class="value">{{ anomaly.value | number:'1.2-2' }} {{ anomaly.unit }}</div>
                <div class="score">Score d'anomalie: {{ anomaly.score | number:'1.2-2' }}</div>
                <div class="time">Détectée à {{ anomaly.timestamp | date:'HH:mm:ss' }}</div>
              </div>
              <button (click)="acknowledge(anomaly.id)">Acquitter</button>
            </div>
          } @empty {
            <div class="no-anomalies">Aucune anomalie détectée</div>
          }
        </div>
      } @else {
        <div class="loading">Initialisation du système de détection...</div>
      }
    </div>
  `
})
export class AnomalyMonitorComponent {
  private sensorFacade = inject(SensorFacadeService);
  private wsService = inject(WebSocketService);
  private alertService = inject(AlertService);
  
  // Combiner les anomalies détectées localement et celles reçues par WebSocket
  anomalies$ = combineLatest([
    // Anomalies détectées par l'analyse statistique locale
    this.sensorFacade.getAnomalousSensors().pipe(
      map(sensors => sensors.map(sensor => ({
        id: `local-${sensor.id}`,
        sensorId: sensor.id,
        sensorName: sensor.name,
        value: sensor.value,
        unit: sensor.unit,
        score: (sensor.value - sensor.baseline) / sensor.deviation,
        severity: sensor.value > sensor.criticalThreshold ? 'critical' : 'warning',
        timestamp: new Date(),
        source: 'local'
      })))
    ),
    
    // Anomalies signalées par le serveur en temps réel
    this.wsService.getCriticalAlerts().pipe(
      map(alerts => alerts.map(alert => ({
        id: `remote-${alert.id}`,
        sensorId: alert.sensorId,
        sensorName: alert.sensorName,
        value: alert.currentValue,
        unit: alert.unit,
        score: alert.anomalyScore,
        severity: alert.severity,
        timestamp: new Date(alert.timestamp),
        source: 'remote'
      }))),
      startWith([])
    )
  ]).pipe(
    // Fusionner les deux sources et trier par sévérité et score
    map(([localAnomalies, remoteAnomalies]) => 
      [...localAnomalies, ...remoteAnomalies].sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        return b.score - a.score;
      })
    ),
    // Partager le résultat entre plusieurs consommateurs
    shareReplay(1)
  );
  
  // Système d'alertes sonores pour les anomalies critiques
  private alertSubscription = this.anomalies$.pipe(
    // Extraire les nouvelles anomalies critiques
    pairwise(),
    map(([prev, curr]) => {
      const prevIds = new Set(prev.filter(a => a.severity === 'critical').map(a => a.sensorId));
      return curr.filter(a => a.severity === 'critical' && !prevIds.has(a.sensorId));
    }),
    filter(newCritical => newCritical.length > 0)
  ).subscribe(criticalAnomalies => {
    // Déclencher une alerte sonore
    this.alertService.playCriticalAlert();
    
    // Notification à l'équipage
    criticalAnomalies.forEach(anomaly => {
      this.alertService.sendCrewNotification({
        title: 'Anomalie critique détectée',
        message: `Capteur ${anomaly.sensorName}: ${anomaly.value} ${anomaly.unit}`,
        severity: 'critical',
        timestamp: anomaly.timestamp
      });
    });
  });
  
  // Acquitter une anomalie
  acknowledge(anomalyId: string): void {
    // Envoi de l'acquittement au serveur
    if (anomalyId.startsWith('remote-')) {
      const realId = anomalyId.replace('remote-', '');
      this.alertService.acknowledgeAlert(realId).subscribe();
    }
  }
}
```

## Bonnes pratiques RxJS en Angular

### Éviter les memory leaks

| Approche | Problème |
|----------|----------|
| ❌ **Souscription manuelle sans unsubscribe** | `this.data$.subscribe(data => this.data = data);` |
| ❌ **Gestion manuelle avec takeUntil** | `takeUntil(this.destroy$)` + `ngOnDestroy` |
| ✅ **Async pipe** | `<div>{{ data$ \| async }}</div>` |

### Opérateurs essentiels dans Angular

| Opérateur | Usage | Exemple |
|-----------|-------|---------|
| `map` | Transformation simple | Modifier la donnée reçue |
| `switchMap` | Changer de source observable | Appel API après valueChanges |
| `combineLatest` | Fusionner plusieurs observables | Afficher des données combinées |
| `filter` | Filtrer les émissions | Ignorer les valeurs nulles |
| `catchError` | Gérer les erreurs | Retourner une valeur par défaut |
| `shareReplay` | Partager les résultats | Éviter les appels API multiples |

### Pattern moderne Angular 17+

```typescript
// Pattern recommandé avec sauces
user$ = this.userService.getUser();

// Template Angular 17+
@if (user$ | async as user) {
  <p>Bienvenue {{ user.name }}</p>
} @else {
  <p>Chargement...</p>
}
```

Avantages:
- ✅ Pas de `subscribe()` manuel
- ✅ Pas de `ngOnDestroy()`
- ✅ Pas de `Subscription`
- ✅ Moins de code
- ✅ Angular gère tout pour vous (performance, annulation, nettoyage)

## Livrables attendus

Pour cette mission, vous devrez:

1. Moderniser l'affichage des capteurs en utilisant le pattern Observable + async pipe
2. Créer un tableau de bord qui combine et filtre plusieurs sources de données
3. Mettre en place un système de détection d'anomalies avec RxJS
4. Implémenter une connexion WebSocket pour les données en temps réel
5. Appliquer les bonnes pratiques pour éviter les fuites mémoire

Cette modernisation du système de capteurs permettra à la station Orion de surveiller efficacement ses systèmes critiques en temps réel, tout en maintenant un code propre, sans fuites mémoire et facile à maintenir.