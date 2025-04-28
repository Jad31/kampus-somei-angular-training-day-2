import { Routes } from '@angular/router';
import { MissionGuard } from './core/guards/mission.guard';
import { MissionResolver } from './core/resolvers/mission.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/components/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/components/home.component').then(
        (m) => m.HomeComponent,
      ),
  },
  {
    path: 'crew',
    loadComponent: () =>
      import('./features/crew/components/crew.component').then(
        (m) => m.CrewComponent,
      ),
  },
  {
    path: 'missions',
    loadComponent: () =>
      import('./features/missions/components/missions/missions.component').then(
        (m) => m.MissionsComponent,
      ),
    resolve: {
      missionData: MissionResolver,
    },
    canActivate: [MissionGuard],
  },
  {
    path: 'resources',
    loadComponent: () =>
      import(
        './features/resources/components/resources/resources.component'
      ).then((m) => m.ResourcesComponent),
  },
  {
    path: 'control-center',
    loadComponent: () =>
      import(
        './features/control-center/components/control-center/control-center.component'
      ).then((m) => m.ControlCenterComponent),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
