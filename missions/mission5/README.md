# Mission 5️⃣ : Modernisation des Formulaires

## Contexte
Les interfaces de contrôle de la station spatiale Orion nécessitent une nouvelle implémentation de leurs formulaires d'interaction. Actuellement, les astronautes doivent gérer manuellement la saisie et la validation des données, ce qui entraîne des erreurs et une expérience utilisateur médiocre. Votre mission consiste à implémenter des formulaires modernes en utilisant l'approche Reactive Forms avec typage fort d'Angular 17.

## Objectif général
Créer une nouvelle architecture de formulaires basée sur Reactive Forms typée, en mettant en place une validation robuste des données et une expérience utilisateur optimale pour garantir la fiabilité des opérations de la station spatiale.

## État initial
Le système actuel ne dispose d'aucun formulaire implémenté. Les astronautes doivent actuellement :
- Saisir les données directement dans des champs de texte non contrôlés
- Valider manuellement les informations
- Gérer les erreurs de saisie sans assistance
- Effectuer des vérifications supplémentaires pour s'assurer de la cohérence des données

## Concepts couverts
- Reactive Forms avec typage fort (Typed Forms)
- FormControl, FormGroup et FormArray typés
- Gestion avancée des validations
- Patterns de gestion d'erreurs
- Formulaires dynamiques et réactifs

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Implémenter un formulaire simple en utilisant l'approche Reactive Forms typée.

**Tâches**:
1. Créer un formulaire d'ajout de mission avec Reactive Forms typé:
   - Définir une interface pour typer le formulaire
   - Implémenter des `FormControl<T>` typés
   - Configurer les validateurs de base (required, minLength, etc.)
   - Mettre en place la gestion basique des erreurs dans le template
2. Développer le template avec `formControlName` et `[formGroup]`
3. Gérer l'état du formulaire (pristine/dirty, valid/invalid)
4. Implémenter des réactions basiques aux changements de valeur avec `valueChanges`

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

## Livrables attendus

1. Formulaire d'ajout de mission implémenté avec Reactive Forms typé
2. Formulaire complexe de mission avec sous-formulaires et validation avancée
3. Système de gestion d'erreurs réutilisable
4. Factory de formulaires pour la génération dynamique
5. Tests unitaires pour les validateurs personnalisés

## Exemple de mise en œuvre

### FormControl typé

```typescript
// Exemple d'implémentation d'un FormControl typé
missionNameControl = new FormControl<string>('', {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(2)],
  updateOn: 'blur'
});
```

### FormGroup typé

```typescript
// Interface pour typer le formulaire
export interface MissionForm {
  name: FormControl<string>;
  description: FormControl<string>;
  startDate: FormControl<Date | null>;
}

// FormGroup typé
missionForm = new FormGroup<MissionForm>({
  name: new FormControl('', { nonNullable: true }),
  description: new FormControl('', { nonNullable: true }),
  startDate: new FormControl(null),
});
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
  };
  
  get message(): string | null {
    if (!this.control || this.control.valid || this.control.pristine) {
      return null;
    }
    
    for (const errorKey of Object.keys(this.errors)) {
      if (this.control.hasError(errorKey)) {
        return this.errors[errorKey];
      }
    }
    
    return 'Champ invalide';
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

## Structure de base des formulaires typés

| Type de contrôle | Exemple d'implémentation |
|-----------------|-------------------------|
| FormControl | `new FormControl<string>('', { nonNullable: true })` |
| FormGroup | `new FormGroup<MissionForm>({...})` |
| FormArray | `new FormArray<FormControl<string>>([...])` |

## Livrables attendus

Pour cette mission, vous devrez:

1. Créer un formulaire d'ajout de mission avec Reactive Forms typés
2. Développer un formulaire complexe de mission avec FormArray et validation avancée
3. Mettre en place un système de gestion d'erreurs réutilisable
4. Implémenter des validateurs personnalisés et asynchrones
5. Créer une factory de formulaires pour la génération dynamique

Cette nouvelle implémentation des formulaires améliorera considérablement la fiabilité des opérations sur la station Orion en garantissant que seules des données valides sont acceptées par le système.