# Mission 5️⃣ : Modernisation des Formulaires

## Contexte
Les interfaces de contrôle de la station spatiale Orion nécessitent une mise à jour majeure de leurs formulaires d'interaction. Les formulaires actuels, basés sur une ancienne architecture non typée, génèrent de nombreuses erreurs et ne fournissent pas une expérience utilisateur optimale aux astronautes. Votre mission consiste à moderniser ces formulaires en utilisant l'approche Reactive Forms avec typage fort d'Angular 17.

## Objectif général
Migrer les formulaires existants vers l'architecture Reactive Forms typée, en améliorant la validation des données et l'expérience utilisateur pour garantir la fiabilité des opérations de la station spatiale.

## État initial
Le système actuel utilise :
- Des formulaires template-driven ou des Reactive Forms non typés
- Une validation basique et inconsistante
- Une gestion d'erreurs rudimentaire
- Pas de réutilisation des logiques de validation

## Concepts couverts
- Reactive Forms avec typage fort (Typed Forms)
- FormControl, FormGroup et FormArray typés
- Gestion avancée des validations
- Patterns de gestion d'erreurs
- Formulaires dynamiques et réactifs

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Migrer un formulaire simple vers l'approche Reactive Forms typée.

**Tâches**:
1. Convertir le formulaire de profil d'astronaute en Reactive Forms typé:
   - Créer une interface `AstronautProfileForm` pour typer le formulaire
   - Remplacer les contrôles non typés par des `FormControl<T>` typés
   - Configurer les validateurs de base (required, minLength, etc.)
   - Implémenter la gestion basique des erreurs dans le template
2. Mettre à jour le template pour utiliser `formControlName` et `[formGroup]`
3. Implémenter l'état du formulaire (pristine/dirty, valid/invalid)
4. Ajouter des réactions basiques aux changements de valeur avec `valueChanges`

**Compétences acquises**:
- Création de formulaires typés avec Reactive Forms
- Configuration des contrôles et des validateurs
- Liaison des formulaires au template
- Gestion de base des états de formulaire

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Créer un formulaire complexe avec formulaires imbriqués et validateurs personnalisés.

**Tâches**:
1. Développer un formulaire de mission spatiale avec sous-formulaires:
   - Formulaire principal avec informations générales
   - Sous-formulaire pour l'équipage (FormArray)
   - Sous-formulaire pour les objectifs de mission (FormArray)
2. Créer des validateurs personnalisés:
   - Validateur pour les noms de mission (interdire certains termes)
   - Validateur pour la date de mission (doit être future)
   - Validateur pour la composition d'équipage (compétences requises)
3. Implémenter un système avancé de gestion des erreurs:
   - Méthode `getError()` pour récupérer les messages d'erreur
   - Affichage conditionnel avec la nouvelle syntaxe `@if` d'Angular 17
4. Utiliser `statusChanges` pour réagir aux changements de validité

**Compétences acquises**:
- Création de formulaires complexes et imbriqués
- Développement de validateurs personnalisés réutilisables
- Gestion avancée des erreurs de formulaire
- Réactivité aux changements d'état de formulaire

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Mettre en place une architecture avancée de formulaires dynamiques avec validation asynchrone et factory.

**Tâches**:
1. Développer une factory de formulaires pour générer des formulaires dynamiquement:
   - Créer un service `FormBuilderService` qui génère des formulaires typés
   - Supporter la construction dynamique basée sur des configurations
   - Permettre l'ajout/suppression dynamique de contrôles
2. Implémenter des validateurs asynchrones:
   - Validateur qui vérifie la disponibilité d'un identifiant de mission
   - Validateur qui vérifie les niveaux d'autorisation dans la base de données
3. Créer un composant réutilisable `FormErrorComponent` pour la gestion des erreurs:
   - Accepte un contrôle en entrée et affiche les messages appropriés
   - Supporte la personnalisation des messages
4. Organiser les validateurs dans une structure réutilisable:
   - Dossier `/shared/validators` avec validateurs par domaine
   - Tests unitaires pour les validateurs complexes

**Compétences acquises**:
- Conception d'architecture avancée de formulaires
- Validation asynchrone avec feedback utilisateur
- Création de composants réutilisables pour les formulaires
- Organisation et test des validateurs

## Exemples de code

### FormControl typé

```typescript
// Avant (non typé)
nameControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

// Après (typé)
nameControl = new FormControl<string>('', {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(2)],
  updateOn: 'blur'
});
```

### FormGroup typé

```typescript
// Interface pour typer le formulaire
export interface EditProfileForm {
  name: FormControl<string>;
  email: FormControl<string>;
  bio: FormControl<string | null>;
}

// FormGroup typé
userForm = new FormGroup<EditProfileForm>({
  name: new FormControl('', { nonNullable: true }),
  email: new FormControl('', { nonNullable: true }),
  bio: new FormControl(null),
});
```

### FormArray typé

```typescript
// FormArray pour gérer une liste de compétences
skills = new FormArray<FormControl<string>>([]);

// Méthode pour ajouter une compétence
addSkill() {
  this.skills.push(new FormControl('', { nonNullable: true }));
}

// Méthode pour supprimer une compétence
removeSkill(index: number) {
  this.skills.removeAt(index);
}
```

### Exemple de Template avec Reactive Form

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label for="name">Nom</label>
    <input id="name" formControlName="name" />
    
    @if (userForm.controls.name.invalid && userForm.controls.name.touched) {
      <p class="error">
        @if (userForm.controls.name.errors?.['required']) {
          Le nom est obligatoire
        } @else if (userForm.controls.name.errors?.['minlength']) {
          Le nom doit contenir au moins 2 caractères
        }
      </p>
    }
  </div>
  
  <div class="form-field">
    <label for="email">Email</label>
    <input id="email" formControlName="email" type="email" />
    
    @if (userForm.controls.email.invalid && userForm.controls.email.touched) {
      <p class="error">
        @if (userForm.controls.email.errors?.['required']) {
          L'email est obligatoire
        } @else if (userForm.controls.email.errors?.['email']) {
          Format d'email invalide
        }
      </p>
    }
  </div>
  
  <div class="form-field">
    <label for="bio">Biographie</label>
    <textarea id="bio" formControlName="bio"></textarea>
  </div>
  
  <button type="submit" [disabled]="userForm.invalid">Enregistrer</button>
</form>
```

### Validateur personnalisé

```typescript
// shared/validators/mission-name.validator.ts
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const forbiddenMissionNameValidator: ValidatorFn = 
  (control: AbstractControl): ValidationErrors | null => {
    const forbidden = ['test', 'demo', 'example'].some(term => 
      control.value?.toLowerCase().includes(term)
    );
    
    return forbidden ? { forbiddenName: true } : null;
  };
```

### Utilisation du validateur

```typescript
missionForm = new FormGroup({
  name: new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required, 
      Validators.minLength(3),
      forbiddenMissionNameValidator
    ]
  }),
  // autres champs...
});
```

### Méthode de gestion d'erreurs

```typescript
getError(controlName: string): string | null {
  const control = this.missionForm.get(controlName);
  
  if (!control || control.valid || control.pristine) {
    return null;
  }
  
  if (control.hasError('required')) {
    return 'Ce champ est obligatoire';
  }
  
  if (control.hasError('minlength')) {
    const requiredLength = control.getError('minlength').requiredLength;
    return `Ce champ doit contenir au moins ${requiredLength} caractères`;
  }
  
  if (control.hasError('forbiddenName')) {
    return 'Ce nom de mission contient des termes interdits';
  }
  
  if (control.hasError('email')) {
    return 'Format d'email invalide';
  }
  
  return 'Champ invalide';
}
```

### Composant réutilisable pour les erreurs

```typescript
// shared/components/form-error/form-error.component.ts
@Component({
  selector: 'app-form-error',
  standalone: true,
  template: `
    @if (message) {
      <p class="error-message">{{ message }}</p>
    }
  `,
  styles: `
    .error-message {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;
  @Input() errors: Record<string, string> = {
    required: 'Ce champ est obligatoire',
    email: 'Format d'email invalide',
    minlength: 'Longueur insuffisante',
    // Errors par défaut...
  };
  
  get message(): string | null {
    if (!this.control || this.control.valid || this.control.pristine) {
      return null;
    }
    
    // Parcours des erreurs pour trouver le premier message applicable
    for (const errorKey of Object.keys(this.errors)) {
      if (this.control.hasError(errorKey)) {
        return this.errors[errorKey];
      }
    }
    
    return 'Champ invalide';
  }
}
```

### Utilisation du composant d'erreur

```html
<div class="form-field">
  <label for="name">Nom</label>
  <input id="name" formControlName="name" />
  <app-form-error [control]="userForm.controls.name"></app-form-error>
</div>
```

### Factory de formulaires

```typescript
// shared/services/form-builder.service.ts
@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  
  createMissionForm(initialData?: Partial<Mission>): FormGroup<MissionForm> {
    return new FormGroup<MissionForm>({
      name: new FormControl(initialData?.name || '', {
        nonNullable: true,
        validators: [Validators.required, forbiddenMissionNameValidator]
      }),
      startDate: new FormControl(initialData?.startDate || null, {
        validators: [Validators.required, futureDateValidator]
      }),
      duration: new FormControl(initialData?.duration || 0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)]
      }),
      objectives: this.createObjectivesArray(initialData?.objectives || []),
      crew: this.createCrewArray(initialData?.crew || [])
    });
  }
  
  private createObjectivesArray(objectives: MissionObjective[]): FormArray<FormGroup<ObjectiveForm>> {
    return new FormArray<FormGroup<ObjectiveForm>>(
      objectives.map(objective => this.createObjectiveForm(objective))
    );
  }
  
  createObjectiveForm(objective?: MissionObjective): FormGroup<ObjectiveForm> {
    return new FormGroup<ObjectiveForm>({
      description: new FormControl(objective?.description || '', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      priority: new FormControl(objective?.priority || 'medium', {
        nonNullable: true
      })
    });
  }
  
  private createCrewArray(crew: CrewAssignment[]): FormArray<FormGroup<CrewAssignmentForm>> {
    return new FormArray<FormGroup<CrewAssignmentForm>>(
      crew.map(member => this.createCrewMemberForm(member))
    );
  }
  
  createCrewMemberForm(member?: CrewAssignment): FormGroup<CrewAssignmentForm> {
    return new FormGroup<CrewAssignmentForm>({
      astronautId: new FormControl(member?.astronautId || '', {
        nonNullable: true,
        validators: [Validators.required],
        asyncValidators: [this.astronautAvailabilityValidator()]
      }),
      role: new FormControl(member?.role || '', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }
  
  astronautAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      // Simulation d'un appel API pour vérifier la disponibilité
      return timer(500).pipe(
        map(() => {
          // Liste simulée d'astronautes indisponibles
          const unavailableAstronauts = ['astro123', 'astro456'];
          return unavailableAstronauts.includes(control.value) 
            ? { astronautUnavailable: true } 
            : null;
        })
      );
    };
  }
}
```

## Organisation des validateurs

```
/shared
  /validators
    /mission
      mission-name.validator.ts
      future-date.validator.ts
    /crew
      astronaut-availability.validator.ts
      required-skills.validator.ts
    /common
      date.validator.ts
      text.validator.ts
    index.ts  // Export de tous les validateurs
```

## Avantages des Reactive Forms typés

- **Type Safety**: Détection des erreurs à la compilation plutôt qu'à l'exécution
- **Auto-complétion**: Meilleur support dans l'IDE avec suggestions précises
- **Immutabilité**: État de formulaire plus prévisible
- **Réactivité**: Intégration native avec RxJS pour réagir aux changements
- **Testabilité**: Plus facile à tester unitairement
- **Scalabilité**: Prise en charge de formulaires complexes et dynamiques

## Migration des Untyped Forms vers Typed Forms

| Avant (Untyped) | Après (Typed) |
|-----------------|---------------|
| `new FormControl()` | `new FormControl<string>('', { nonNullable: true })` |
| `new FormGroup({...})` | `new FormGroup<UserForm>({...})` |
| `new FormArray([...])` | `new FormArray<FormControl<string>>([...])` |

## Livrables attendus

Pour cette mission, vous devrez:

1. Créer un formulaire de profil d'astronaute avec Reactive Forms typés
2. Développer un formulaire complexe de mission avec FormArray et validation avancée
3. Mettre en place un système de gestion d'erreurs réutilisable
4. Implémenter des validateurs personnalisés et asynchrones
5. Créer une factory de formulaires pour la génération dynamique

Cette modernisation des formulaires améliorera considérablement la fiabilité des opérations sur la station Orion en garantissant que seules des données valides sont acceptées par le système.