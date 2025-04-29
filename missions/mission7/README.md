# Mission 7️⃣ : Modernisation du Système de Gestion des Missions

## Contexte
Le système de gestion des missions de la station spatiale Orion nécessite une modernisation pour améliorer sa réactivité. Actuellement, le système utilise des approches traditionnelles pour la gestion des données, ce qui peut entraîner des problèmes de performance. Votre mission est de moderniser le système en utilisant la programmation réactive avec RxJS.

## Objectif général
Transformer le système de gestion des missions pour utiliser une architecture réactive basée sur RxJS, en optimisant la gestion des données.

## État initial
Le système actuel présente plusieurs points à améliorer :
- Gestion traditionnelle des données avec des variables de classe
- Souscriptions manuelles sans gestion explicite de la désinscription
- Calculs des statistiques effectués de manière impérative
- Gestion des erreurs basique

## Concepts RxJS fondamentaux

1. **Observable** : Un flux de données qui peut être observé
2. **Pipe** : Une série d'opérations pour transformer les données
3. **Async Pipe** : Un pipe Angular qui gère automatiquement les souscriptions

## Concepts couverts
- Fondamentaux RxJS et programmation réactive
- Opérateurs RxJS de base (map, switchMap)
- Gestion des souscriptions avec async pipe
- Patterns modernes Angular pour RxJS

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Moderniser l'affichage des missions avec le pattern Observable + async pipe.

**Tâches**:
1. Convertir le composant `MissionsComponent` pour utiliser les Observables:
   - Remplacer les variables de classe par des Observables
   - Utiliser le pipe async dans les templates
   - Ajouter un indicateur de chargement
2. Appliquer des transformations simples sur les données:
   - Utiliser `map` pour transformer les données
   - Filtrer les missions selon leur statut
3. Mettre en place un rafraîchissement simple:
   - Utiliser `switchMap` pour mettre à jour les données

**Compétences acquises**:
- Utilisation du pattern Observable + async pipe
- Manipulation des opérateurs RxJS de base
- Prévention des fuites mémoire grâce au async pipe

### Exemple de code pour le niveau junior

```typescript
// missions.component.ts
@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (missions$ | async; as missions) {
      <div class="missions-grid">
        @for (mission of missions; track mission.id) {
          <div class="mission-card">
            <h3>{{ mission.name }}</h3>
            <div class="status">{{ mission.status }}</div>
            <div class="details">
              <div>Priorité: {{ mission.priority }}</div>
              <div>Date: {{ mission.startDate | date }}</div>
            </div>
            <div class="actions">
              <button (click)="startMission(mission.id)">Démarrer</button>
              <button (click)="completeMission(mission.id)">Terminer</button>
            </div>
          </div>
        }
      </div>
    } @else if (loading$ | async) {
      <div class="loading">Chargement...</div>
    } @else if (error$ | async; as error) {
      <div class="error">{{ error }}</div>
    }
  `
})
export class MissionsComponent {
  private missionsService = inject(MissionsService);
  
  // Observable pour les missions
  missions$ = this.missionsService.getAllMissions().pipe(
    map(missions => missions.sort((a, b) => 
      this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority)
    ))
  );
  
  // Observable pour l'état de chargement
  loading$ = this.missions$.pipe(
    map(() => false),
    startWith(true)
  );
  
  // Observable pour les erreurs
  error$ = this.missions$.pipe(
    map(() => null),
    catchError(err => of('Erreur: ' + err.message))
  );
  
  private getPriorityValue(priority: MissionPriority): number {
    return { high: 3, medium: 2, low: 1 }[priority];
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

| Approche | Problème | Solution |
|----------|----------|----------|
| ❌ Souscription manuelle | `this.missions$.subscribe(missions => this.missions = missions);` | Fuite mémoire |
| ✅ Async pipe | `<div>{{ missions$ \| async }}</div>` | Pas de fuite |

### Opérateurs essentiels

| Opérateur | Usage | Exemple |
|-----------|-------|---------|
| `map` | Transformer les données | `map(missions => missions.sort())` |
| `switchMap` | Changer de source | `switchMap(() => this.missionsService.getAllMissions())` |
| `catchError` | Gérer les erreurs | `catchError(err => of('Erreur'))` |

### Pattern moderne Angular

```typescript
// Pattern recommandé
missions$ = this.missionsService.getAllMissions();

// Template
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
- ✅ Moins de code
- ✅ Angular gère tout pour vous

## Livrables attendus

Pour cette mission, vous devrez:

1. Moderniser l'affichage des missions en utilisant le pattern Observable + async pipe
2. Implémenter les transformations de données avec les opérateurs RxJS de base
3. Gérer les états de chargement et d'erreur de manière réactive
4. Appliquer les bonnes pratiques pour éviter les fuites mémoire

Cette modernisation du système permettra à la station Orion de suivre efficacement ses missions, tout en maintenant un code propre et facile à maintenir.