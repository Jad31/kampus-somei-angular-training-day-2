# Mission 7️⃣ : Modernisation du Système de Gestion des Missions

## Contexte
Le système de gestion des missions de la station spatiale Orion nécessite une modernisation pour améliorer sa réactivité et sa performance. Actuellement, le système utilise des approches impératives pour la gestion des données et des états, ce qui peut entraîner des problèmes de performance et de maintenabilité. Votre mission est de moderniser le système en utilisant la programmation réactive avec RxJS et les meilleures pratiques Angular 17.

## Objectif général
Transformer le système de gestion des missions pour utiliser une architecture réactive basée sur RxJS, en optimisant la gestion des états et des flux de données.

## État initial
Le système actuel présente plusieurs points à améliorer :
- Gestion impérative des états avec des variables de classe
- Souscriptions manuelles sans gestion explicite de la désinscription
- Calculs des statistiques effectués de manière impérative
- Gestion des erreurs basique
- Rafraîchissement manuel des données

## Concepts RxJS fondamentaux

![Fondamentaux RxJS](https://raw.githubusercontent.com/votre-repo/codequest/main/assets/rxjs-fundamentals.png)

1. **Source** : API REST pour les missions
2. **Pipe d'opérateurs** : Transformation et combinaison des données
3. **Souscription** : Affichage des données dans le template

## Concepts couverts
- Fondamentaux RxJS et programmation réactive
- Opérateurs RxJS essentiels (map, switchMap, combineLatest, etc.)
- Gestion des souscriptions et prévention des fuites mémoire
- Patterns modernes Angular pour RxJS
- Architecture réactive pour la gestion d'état

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Moderniser l'affichage des missions avec le pattern Observable + async pipe.

**Tâches**:
1. Convertir le composant `MissionsComponent` pour utiliser le pattern Observable:
   - Remplacer les variables de classe par des Observables
   - Utiliser le pipe async dans les templates avec la nouvelle syntaxe `@if` d'Angular 17
   - Implémenter un indicateur de chargement avec le pattern async
2. Appliquer les transformations de base sur les données des missions:
   - Utiliser `map` pour transformer les données brutes
   - Filtrer les missions selon leur statut avec `filter`
   - Trier les missions par priorité avec `map`
3. Mettre en place un système de rafraîchissement périodique:
   - Utiliser `interval` pour créer un flux périodique
   - Combiner avec `switchMap` pour déclencher des requêtes API

**Compétences acquises**:
- Utilisation du pattern Observable + async pipe
- Manipulation des opérateurs RxJS de base
- Prévention des fuites mémoire grâce au async pipe
- Création de flux périodiques

### Exemple de code pour le niveau junior

```typescript
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
  private missionsService = inject(MissionsService);
  
  // Observable pour les missions avec tri par priorité
  missions$ = this.missionsService.getAllMissions().pipe(
    map(missions => missions.sort((a, b) => 
      this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority)
    )),
    shareReplay(1)
  );
  
  // Observable pour l'état de chargement
  loading$ = this.missions$.pipe(
    map(() => false),
    startWith(true),
    catchError(() => of(false))
  );
  
  // Observable pour les erreurs
  error$ = this.missions$.pipe(
    map(() => null),
    catchError(err => of('Erreur lors du chargement des missions: ' + err.message))
  );
  
  // Observable pour les statistiques
  stats$ = this.missions$.pipe(
    map(missions => ({
      totalMissions: missions.length,
      activeMissions: missions.filter(m => m.status === 'in-progress').length,
      successRate: this.calculateSuccessRate(missions)
    }))
  );
  
  private getPriorityValue(priority: MissionPriority): number {
    return { high: 3, medium: 2, low: 1 }[priority];
  }
  
  private calculateSuccessRate(missions: Mission[]): number {
    const completed = missions.filter(m => m.status === 'completed').length;
    return missions.length > 0 ? Math.round((completed / missions.length) * 100) : 0;
  }
  
  startMission(missionId: string): void {
    this.missionsService.updateMissionStatus(missionId, 'in-progress').pipe(
      switchMap(() => this.missionsService.getAllMissions())
    ).subscribe();
  }
  
  completeMission(missionId: string): void {
    this.missionsService.updateMissionStatus(missionId, 'completed').pipe(
      switchMap(() => this.missionsService.getAllMissions())
    ).subscribe();
  }
}
```

## Bonnes pratiques RxJS en Angular

### Éviter les memory leaks

| Approche | Problème |
|----------|----------|
| ❌ **Souscription manuelle sans unsubscribe** | `this.missions$.subscribe(missions => this.missions = missions);` |
| ❌ **Gestion manuelle avec takeUntil** | `takeUntil(this.destroy$)` + `ngOnDestroy` |
| ✅ **Async pipe** | `<div>{{ missions$ \| async }}</div>` |

### Opérateurs essentiels dans Angular

| Opérateur | Usage | Exemple |
|-----------|-------|---------|
| `map` | Transformation simple | Calculer les statistiques |
| `switchMap` | Changer de source observable | Mise à jour après action |
| `combineLatest` | Fusionner plusieurs observables | Statistiques combinées |
| `filter` | Filtrer les émissions | Missions actives |
| `catchError` | Gérer les erreurs | Message d'erreur |
| `shareReplay` | Partager les résultats | Éviter les appels multiples |

### Pattern moderne Angular 17+

```typescript
// Pattern recommandé
missions$ = this.missionsService.getAllMissions();

// Template Angular 17+
@if (missions$ | async as missions) {
  <div class="missions-grid">
    @for (mission of missions; track mission.id) {
      <app-mission-card [mission]="mission"></app-mission-card>
    }
  </div>
} @else {
  <app-loading></app-loading>
}
```

Avantages:
- ✅ Pas de `subscribe()` manuel
- ✅ Pas de `ngOnDestroy()`
- ✅ Pas de `Subscription`
- ✅ Moins de code
- ✅ Angular gère tout pour vous

## Livrables attendus

Pour cette mission, vous devrez:

1. Moderniser l'affichage des missions en utilisant le pattern Observable + async pipe
2. Implémenter les transformations de données avec les opérateurs RxJS appropriés
3. Mettre en place un système de rafraîchissement périodique
4. Gérer les états de chargement et d'erreur de manière réactive
5. Appliquer les bonnes pratiques pour éviter les fuites mémoire

Cette modernisation du système de gestion des missions permettra à la station Orion de suivre efficacement ses missions, tout en maintenant un code propre, sans fuites mémoire et facile à maintenir.