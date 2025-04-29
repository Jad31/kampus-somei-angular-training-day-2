import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface MissionData {
  totalMissions: number;
  activeMissions: number;
  lastUpdate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class MissionResolver implements Resolve<MissionData> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<MissionData> {
    // Simuler le chargement des données initiales des missions
    const missionData: MissionData = {
      totalMissions: 42,
      activeMissions: 7,
      lastUpdate: new Date(),
    };

    // Simuler un délai réseau de 1 seconde
    return of(missionData);
  }
}
