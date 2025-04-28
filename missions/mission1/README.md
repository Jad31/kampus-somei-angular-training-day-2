# Mission 1️⃣ : Migration vers les Composants Standalone

## Contexte
La station spatiale Orion fonctionne avec un système d'exploitation basé sur Angular v15. Le centre de contrôle a ordonné une mise à jour vers Angular v17 pour améliorer les performances et la sécurité. Votre première mission consiste à moderniser les composants existants en les convertissant en composants standalone.

## Objectif général
Migrer tous les composants de l'application vers l'architecture standalone d'Angular 17, en intégrant la nouvelle syntaxe de control flow.

## État initial
Le système contient actuellement :
- Des composants dans les features suivantes : Home, Missions, Resources, Control Center, Crew
- Un système de composants basé sur NgModules
- Des composants utilisant l'ancienne syntaxe (*ngIf, *ngFor, etc.)

## Concepts couverts
- Conversion vers les composants standalone
- Nouvelle syntaxe de control flow (@if, @for, @switch)
- Cycle de vie des composants
- Gestion des imports directs

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Convertir les composants de base en standalone.

**Tâches**:
1. Convertir les composants de la feature Home en standalone
2. Transformer les directives *ngIf en utilisant @if
3. Mettre à jour les imports nécessaires
4. Vérifier le bon fonctionnement des composants

**Compétences acquises**:
- Transformation de composants en standalone
- Utilisation de @if/@else
- Gestion des dépendances explicites

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Migrer les composants plus complexes et implémenter les nouvelles syntaxes.

**Tâches**:
1. Convertir les composants des features Missions et Resources
2. Transformer les *ngFor en @for avec track
3. Remplacer les ngSwitch par @switch
4. Gérer les communications entre composants standalone

**Compétences acquises**:
- Utilisation complète du control flow
- Optimisation des listes avec track
- Communication entre composants standalone

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Finaliser la migration et optimiser les composants.

**Tâches**:
1. Convertir les composants restants (Control Center, Crew)
2. Implémenter tous les hooks du cycle de vie
3. Optimiser les interactions entre composants
4. Assurer la gestion du cleanup dans ngOnDestroy

**Compétences acquises**:
- Maîtrise du cycle de vie des composants
- Optimisation des performances
- Gestion des références et projections

## Livrables attendus

1. Tous les composants convertis en standalone
2. Nouvelle syntaxe de control flow implémentée
3. Cycle de vie des composants optimisé
4. Tests fonctionnels validant les migrations

## Exemple de migration d'un composant

### Avant (avec NgModule)

```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  systemStatus: 'online' | 'offline' | 'maintenance' = 'online';
  
  // Méthodes et propriétés...
}

// dashboard.component.html
<div class="status-container">
  <div *ngIf="systemStatus === 'online'; else offlineTemplate">
    <p class="status-text">Tous les systèmes sont opérationnels</p>
  </div>
  <ng-template #offlineTemplate>
    <p class="error-text">ALERTE: Systèmes hors ligne ou en maintenance</p>
  </ng-template>
</div>
```

### Après (avec Standalone Component)

```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent {
  systemStatus: 'online' | 'offline' | 'maintenance' = 'online';
  
  // Méthodes et propriétés...
}

// dashboard.component.html
<div class="status-container">
  @if (systemStatus === 'online') {
    <p class="status-text">Tous les systèmes sont opérationnels</p>
  } @else {
    <p class="error-text">ALERTE: Systèmes hors ligne ou en maintenance</p>
  }
</div>
```

## Exemple de conversion de @for avec track

### Avant

```html
<ul class="systems-list">
  <li *ngFor="let system of systems; trackBy: trackSystemById" [class]="system.status">
    {{ system.name }} - {{ system.status }}
  </li>
  <li *ngIf="systems.length === 0">Aucun système détecté</li>
</ul>
```

### Après

```html
<ul class="systems-list">
  @for (system of systems; track system.id) {
    <li [class]="system.status">
      {{ system.name }} - {{ system.status }}
    </li>
  } @empty {
    <li>Aucun système détecté</li>
  }
</ul>
```

## Exemple de conversion de @switch

### Avant

```html
<div [ngSwitch]="alertLevel">
  <p *ngSwitchCase="'critical'" class="critical">ALERTE CRITIQUE</p>
  <p *ngSwitchCase="'warning'" class="warning">Avertissement</p>
  <p *ngSwitchDefault class="normal">Statut normal</p>
</div>
```

### Après

```html
@switch (alertLevel) {
  @case ('critical') {
    <p class="critical">ALERTE CRITIQUE</p>
  }
  @case ('warning') {
    <p class="warning">Avertissement</p>
  }
  @default {
    <p class="normal">Statut normal</p>
  }
}
```

## Cycle de vie des composants

### Hooks classiques (dans l'ordre d'exécution)

1. **constructor** - Initialisation de base
2. **ngOnChanges** - Appelé lorsque les propriétés @Input changent
3. **ngOnInit** - Après la première exécution de ngOnChanges
4. **ngDoCheck** - Après ngOnChanges et ngOnInit
5. **ngAfterContentInit** - Après la projection du contenu
6. **ngAfterContentChecked** - Après chaque vérification du contenu projeté
7. **ngAfterViewInit** - Après l'initialisation des vues
8. **ngAfterViewChecked** - Après chaque vérification des vues
9. **ngOnDestroy** - Avant la destruction du composant

### Nouveaux hooks Angular 17

- **afterRender** - Après que le composant et ses enfants ont été rendus
- **afterNextRender** - Après le prochain cycle de rendu

## Exemple d'implémentation du cycle de vie complet

```typescript
@Component({
  selector: 'app-mission-control',
  templateUrl: './mission-control.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class MissionControlComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() missionId: string = '';
  @ViewChild('telemetryChart') telemetryChart!: ElementRef;
  
  private dataSubscription: Subscription | null = null;
  
  constructor(private missionService: MissionService) {
    console.log('1. Constructor called');
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log('2. Input properties changed', changes);
    if (changes['missionId']) {
      this.loadMissionData();
    }
  }
  
  ngOnInit() {
    console.log('3. Component initialized');
    // Initialisation des données
  }
  
  ngAfterViewInit() {
    console.log('4. View initialized');
    // Initialisation des éléments DOM
    if (this.telemetryChart) {
      // Configuration du graphique après rendu DOM
    }
  }
  
  afterRender() {
    console.log('Component rendered');
    // Nouveau hook Angular 17 - après le rendu
  }
  
  afterNextRender() {
    console.log('After next render cycle');
    // Exécuté après le prochain cycle de rendu
  }
  
  ngOnDestroy() {
    console.log('5. Component destroyed');
    // Nettoyage des souscriptions
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  
  private loadMissionData() {
    this.dataSubscription = th