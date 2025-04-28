import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

type MissionStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

type MissionPriority = 'low' | 'medium' | 'high';

interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  priority: MissionPriority;
  startDate: Date;
  endDate?: Date;
}

interface MissionStats {
  totalMissions: number;
  activeMissions: number;
  lastUpdate: Date;
}

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [
    {
      id: '1',
      name: 'Exploration de Mars',
      status: 'in-progress',
      priority: 'high',
      startDate: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Maintenance des systèmes',
      status: 'pending',
      priority: 'medium',
      startDate: new Date('2024-02-01'),
    },
    {
      id: '3',
      name: 'Analyse des données',
      status: 'completed',
      priority: 'low',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
    },
  ];

  missionStats!: MissionStats;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.missionStats = this.route.snapshot.data['missionData'];
  }

  trackById(index: number, mission: Mission): string {
    return mission.id;
  }

  getStatusClass(status: Mission['status']): string {
    return `status-${status}`;
  }

  getPriorityClass(priority: Mission['priority']): string {
    return `priority-${priority}`;
  }

  startMission(mission: Mission): void {
    mission.status = 'in-progress';
    this.updateMissionStats();
  }

  pauseMission(mission: Mission): void {
    mission.status = 'pending';
    this.updateMissionStats();
  }

  completeMission(mission: Mission): void {
    mission.status = 'completed';
    mission.endDate = new Date();
    this.updateMissionStats();
  }

  private updateMissionStats(): void {
    this.missionStats = {
      totalMissions: this.missions.length,
      activeMissions: this.missions.filter(m => m.status === 'in-progress').length,
      lastUpdate: new Date()
    };
  }

  getMissionDuration(mission: Mission): number {
    if (!mission.endDate) return 0;
    const diffTime = Math.abs(mission.endDate.getTime() - mission.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSuccessRate(): number {
    const completedMissions = this.missions.filter(m => m.status === 'completed').length;
    return Math.round((completedMissions / this.missions.length) * 100);
  }

  getAverageDuration(): number {
    const completedMissions = this.missions.filter(m => m.status === 'completed' && m.endDate);
    if (completedMissions.length === 0) return 0;
    
    const totalDuration = completedMissions.reduce((sum, mission) => {
      return sum + this.getMissionDuration(mission);
    }, 0);
    
    return Math.round(totalDuration / completedMissions.length);
  }

  getPriorityDistribution(): { high: number; medium: number; low: number } {
    return {
      high: this.missions.filter(m => m.priority === 'high').length,
      medium: this.missions.filter(m => m.priority === 'medium').length,
      low: this.missions.filter(m => m.priority === 'low').length
    };
  }

  getEfficiencyRate(): number {
    const completedMissions = this.missions.filter(m => m.status === 'completed').length;
    const inProgressMissions = this.missions.filter(m => m.status === 'in-progress').length;
    const totalActiveMissions = completedMissions + inProgressMissions;
    
    if (totalActiveMissions === 0) return 0;
    return Math.round((completedMissions / totalActiveMissions) * 100);
  }
}
