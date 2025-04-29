import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Mission } from './missions.types';
@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  private http = inject(HttpClient);

  private missionsUrl = 'http://localhost:3000/missions';

  getAllMissions() {
    return this.http.get<Mission[]>(this.missionsUrl).pipe(
      map((missions) =>
        missions.map((mission) => {
          console.log({ mission });
          return mission;
        }),
      ),
    );
  }
}
