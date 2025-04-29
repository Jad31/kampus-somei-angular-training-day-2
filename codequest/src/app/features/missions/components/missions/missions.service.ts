import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mission, MissionStats } from './missions.types';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  private http = inject(HttpClient);
  private missionsUrl = 'http://localhost:3000/missions';

  getAllMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.missionsUrl);
  }

  getMissionById(id: string): Observable<Mission | undefined> {
    return this.http.get<Mission>(`${this.missionsUrl}/${id}`);
  }

  getMissionStats(): Observable<MissionStats> {
    return this.http.get<MissionStats>(`${this.missionsUrl}/stats`);
  }
}
