# Mission 6️⃣ : Modernisation des Communications API

## Contexte
La station spatiale Orion doit maintenir des communications constantes avec le centre de contrôle terrestre et les autres modules spatiaux. Le système actuel utilise des méthodes obsolètes pour les communications API, ce qui cause des problèmes de fiabilité et des difficultés de maintenance. Votre mission consiste à moderniser l'infrastructure de communication en utilisant les dernières pratiques d'Angular 17 pour les interactions API.

## Objectif général
Migrer et optimiser les services de communication API du système Orion en utilisant HttpClient avec typage fort, interceptors modernes, et une architecture orientée service conforme aux bonnes pratiques Angular 17.

## État initial
Le système actuel utilise :
- Des appels API basés sur l'ancien module HTTP d'Angular
- Des interceptors basés sur classes
- Un typage insuffisant des réponses API
- Une gestion des erreurs inconsistante

## Concepts couverts
- HttpClient avec typage fort
- Architecture des services API
- Interceptors fonctionnels modernes
- Gestion des erreurs et retry
- Modèles de communication composant-service-API

## Structure d'appel API dans Angular

![Structure API](https://raw.githubusercontent.com/votre-repo/codequest/main/assets/api-structure.png)

1. **Composant** : Injecte et appelle le service (méthode → service)
2. **Service** : Encapsule la logique métier et appelle HttpClient (get()/post()/etc.)
3. **HttpClient** : Gère les détails des requêtes HTTP (URL + headers, token...)
4. **Interceptors** : Modifient les requêtes/réponses (ajout de tokens, gestion d'erreurs)
5. **API** : Point de terminaison externe recevant les requêtes

## Détail des niveaux

### 👨‍🚀 Niveau Recrue (Junior)

**Objectif**: Mettre à jour les services API de base avec HttpClient typé.

**Tâches**:
1. Migrer l'ancien service `AstronautService` vers HttpClient moderne:
   - Remplacer XMLHttpRequest ou anciens appels HTTP par HttpClient
   - Ajouter un typage fort pour les réponses API
   - Créer des DTOs pour les données envoyées et reçues
2. Implémenter la gestion des erreurs de base avec catchError
3. Mettre à jour les composants qui utilisent ce service
4. Configurer la gestion des URL d'API via l'environnement

**Compétences acquises**:
- Utilisation de HttpClient avec typage
- Manipulation des observables pour les requêtes HTTP
- Configuration de base des services API
- Gestion des erreurs HTTP

### 👩‍🔬 Niveau Technicien (Mid)

**Objectif**: Développer une architecture complète de services API avec des fonctionnalités avancées.

**Tâches**:
1. Créer une hiérarchie de services API organisée par fonctionnalité:
   - `MissionApiService` pour les opérations liées aux missions
   - `ResourceApiService` pour la gestion des ressources
   - `TelemetryApiService` pour les données de télémétrie
2. Implémenter des opérations CRUD complètes avec typage:
   - GET, POST, PUT, DELETE avec les types appropriés
   - Paramètres de requête typés
   - Headers personnalisés
3. Ajouter des fonctionnalités avancées:
   - Requêtes avec progress events
   - Retry automatique pour les échecs temporaires
   - Mapping des réponses via pipes RxJS
4. Créer un service d'erreur centralisé pour la gestion cohérente des erreurs API

**Compétences acquises**:
- Architecture de services API par domaine fonctionnel
- Opérations CRUD complètes et typées
- Transformation de données avec RxJS
- Stratégies avancées de gestion d'erreurs

### 👨‍✈️ Niveau Commandant (Senior)

**Objectif**: Moderniser les interceptors et mettre en place une infrastructure API robuste et extensible.

**Tâches**:
1. Migrer les interceptors basés sur classes vers l'approche fonctionnelle:
   - Convertir `AuthInterceptor` en fonction `authInterceptor`
   - Mettre à jour la configuration avec `provideHttpClient(withInterceptors([...]))`
2. Implémenter une chaîne d'interceptors spécialisés:
   - Interceptor d'authentification
   - Interceptor de logging
   - Interceptor de gestion d'erreurs
   - Interceptor de cache
3. Mettre en place un système de simulation API (mocking) pour le développement:
   - Service de mock configurable
   - Interceptor conditionnel pour le mode développement
4. Développer un mécanisme de mise en file d'attente des requêtes pour gérer les pertes de connexion temporaires

**Compétences acquises**:
- Interceptors fonctionnels modernes
- Configuration avancée de HttpClient
- Techniques de simulation API
- Stratégies de résilience pour les communications instables

## Exemples de code

### Service API avec HttpClient typé

```typescript
// astronaut.dto.ts
export interface AstronautDto {
  id: string;
  name: string;
  rank: string;
  specialization: string;
  activeStatus: boolean;
}

export interface CreateAstronautDto {
  name: string;
  rank: string;
  specialization: string;
}

export type UpdateAstronautDto = Partial<CreateAstronautDto>;

// astronaut.service.ts
@Injectable({
  providedIn: 'root'
})
export class AstronautService {
  private apiUrl = inject(ENVIRONMENT).apiBaseUrl + '/astronauts';
  private http = inject(HttpClient);
  
  getAll(): Observable<AstronautDto[]> {
    return this.http.get<AstronautDto[]>(this.apiUrl);
  }
  
  getById(id: string): Observable<AstronautDto> {
    return this.http.get<AstronautDto>(`${this.apiUrl}/${id}`);
  }
  
  create(astronaut: CreateAstronautDto): Observable<AstronautDto> {
    return this.http.post<AstronautDto>(this.apiUrl, astronaut);
  }
  
  update(id: string, changes: UpdateAstronautDto): Observable<AstronautDto> {
    return this.http.put<AstronautDto>(`${this.apiUrl}/${id}`, changes);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Gestion d'erreurs HTTP

```typescript
// error-handler.service.ts
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private notification = inject(NotificationService);
  private logger = inject(LoggingService);
  
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
      this.logger.error('Client error:', error.error);
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 403:
          errorMessage = 'Accès non autorisé';
          break;
        case 401:
          errorMessage = 'Authentification requise';
          // Rediriger vers la page de login
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
      
      this.logger.error('Server error:', error);
    }
    
    this.notification.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

// Utilisation dans un service
getAstronauts(): Observable<AstronautDto[]> {
  return this.http.get<AstronautDto[]>(this.apiUrl)
    .pipe(
      catchError(error => this.errorHandler.handleError(error)),
      retry({ count: 3, delay: 1000 }) // Réessayer 3 fois avec 1s d'intervalle
    );
}
```

### Interceptor fonctionnel moderne

```typescript
// Avant - Interceptor basé sur classe (Angular < 15)
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next.handle(authReq);
  }
}

// Après - Interceptor fonctionnel (Angular 17)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(authReq);
};

// Configuration dans app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loggingInterceptor,
        errorInterceptor
      ])
    )
  ]
};
```

### Chaîne d'interceptors spécialisés

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};

// logging.interceptor.ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = Date.now();
  console.log(`Request ${req.method} ${req.url} started at ${new Date().toISOString()}`);
  
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - start;
          console.log(`Request ${req.method} ${req.url} completed in ${duration}ms with status ${event.status}`);
        }
      },
      error: (error) => {
        const duration = Date.now() - start;
        console.error(`Request ${req.method} ${req.url} failed in ${duration}ms with status ${error.status}`);
      }
    })
  );
};

// error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Rediriger vers la page de login
        const authService = inject(AuthService);
        authService.redirectToLogin();
      }
      return throwError(() => error);
    })
  );
};

// cache.interceptor.ts
export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Ne mettre en cache que les requêtes GET
  if (req.method !== 'GET') {
    return next(req);
  }
  
  const cacheService = inject(CacheService);
  const cachedResponse = cacheService.get(req.url);
  
  if (cachedResponse) {
    return of(cachedResponse);
  }
  
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cacheService.set(req.url, event);
      }
    })
  );
};
```

### Utilisation du service API dans un composant

```typescript
@Component({
  selector: 'app-astronaut-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="astronaut-container">
      <h2>Équipage de la station</h2>
      
      @if (astronauts$ | async; as astronauts) {
        <ul class="astronaut-list">
          @for (astronaut of astronauts; track astronaut.id) {
            <li class="astronaut-item" [class.active]="astronaut.activeStatus">
              <h3>{{ astronaut.name }} - {{ astronaut.rank }}</h3>
              <p>Spécialité: {{ astronaut.specialization }}</p>
              <button (click)="assignToMission(astronaut)">Assigner à mission</button>
            </li>
          } @empty {
            <li>Aucun membre d'équipage disponible</li>
          }
        </ul>
      } @else {
        <div class="loading">Chargement de l'équipage...</div>
      }
      
      @if (error) {
        <div class="error-banner">{{ error }}</div>
      }
    </div>
  `
})
export class AstronautListComponent {
  private astronautService = inject(AstronautService);
  private notificationService = inject(NotificationService);
  
  astronauts$ = this.astronautService.getAll().pipe(
    catchError(error => {
      this.error = 'Impossible de charger la liste de l'équipage';
      return EMPTY;
    })
  );
  
  error: string | null = null;
  
  assignToMission(astronaut: AstronautDto): void {
    this.astronautService.assignToMission(astronaut.id, { missionId: 'current-mission' })
      .subscribe({
        next: () => this.notificationService.success(`${astronaut.name} assigné à la mission`),
        error: (err) => this.notificationService.error('Échec de l\'assignation')
      });
  }
}
```

### Service de mock API pour le développement

```typescript
// mock.interceptor.ts
export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const mockService = inject(MockService);
  const environment = inject(ENVIRONMENT);
  
  // N'activer le mock que dans l'environnement de développement
  if (!environment.enableMocking) {
    return next(req);
  }
  
  // Vérifier si nous avons une réponse mockée pour cette requête
  const mockResponse = mockService.getMockResponse(req.method, req.url);
  
  if (mockResponse) {
    // Simuler un délai réseau
    return timer(300).pipe(
      map(() => new HttpResponse({
        status: 200,
        body: mockResponse
      }))
    );
  }
  
  // Pas de mock trouvé, continuer avec la requête normale
  return next(req);
};

// mock.service.ts
@Injectable({
  providedIn: 'root'
})
export class MockService {
  private mockData: Record<string, Record<string, any>> = {
    GET: {
      '/api/astronauts': [
        { id: 'ast-1', name: 'Jane Doe', rank: 'Commander', specialization: 'Navigation', activeStatus: true },
        { id: 'ast-2', name: 'John Smith', rank: 'Engineer', specialization: 'Systems', activeStatus: true },
        { id: 'ast-3', name: 'Alice Johnson', rank: 'Science Officer', specialization: 'Biology', activeStatus: false }
      ],
      '/api/missions': [
        { id: 'mission-1', name: 'Station Maintenance', status: 'in-progress' },
        { id: 'mission-2', name: 'Satellite Deployment', status: 'scheduled' }
      ]
    },
    POST: {
      // Réponses pour les requêtes POST
    }
  };
  
  getMockResponse(method: string, url: string): any {
    if (!this.mockData[method]) {
      return null;
    }
    
    // Extraire l'ID de l'URL pour les requêtes de détail (ex: /api/astronauts/ast-1)
    if (url.includes('/')) {
      const segments = url.split('/');
      const baseUrl = segments.slice(0, -1).join('/');
      const id = segments[segments.length - 1];
      
      // Si c'est une URL avec ID et nous avons des données pour la base
      if (this.mockData[method][baseUrl] && Array.isArray(this.mockData[method][baseUrl])) {
        return this.mockData[method][baseUrl].find((item: any) => item.id === id) || null;
      }
    }
    
    return this.mockData[method][url] || null;
  }
  
  // Méthodes pour ajouter/modifier des mocks dynamiquement
  addMockResponse(method: string, url: string, data: any): void {
    if (!this.mockData[method]) {
      this.mockData[method] = {};
    }
    this.mockData[method][url] = data;
  }
}
```

## Avantages de l'approche moderne des API

- **Typage fort**: Détection des erreurs à la compilation plutôt qu'à l'exécution
- **Architecture modulaire**: Services organisés par domaine fonctionnel
- **Interceptors fonctionnels**: Plus simple à tester et à composer
- **Gestion d'erreurs centralisée**: Traitement cohérent des erreurs
- **Résilience**: Stratégies de retry et file d'attente pour connexions instables
- **Séparation des préoccupations**: Composants, services, DTOs et interceptors avec des responsabilités claires

## Livrables attendus

Pour cette mission, vous devrez:

1. Migrer tous les services API existants vers HttpClient avec typage fort
2. Créer des DTOs pour toutes les entités manipulées (entrée/sortie API)
3. Implémenter au moins trois interceptors fonctionnels (auth, logging, error)
4. Mettre en place un système de gestion d'erreurs centralisé
5. Configurer le système API pour fonctionner aussi bien en développement qu'en production

Cette modernisation des communications API améliorera considérablement la fiabilité des échanges de données de la station Orion avec les systèmes externes, tout en facilitant la maintenance et l'évolution du code.