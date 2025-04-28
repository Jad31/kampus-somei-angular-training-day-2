import { Injectable } from '@nestjs/common';
import { Mission, MissionStats } from './interfaces/mission.interface';

@Injectable()
export class MissionsService {
  private missions: Mission[] = [
    {
      id: 1,
      title: 'Mars Exploration',
      description: 'Initial survey of potential landing sites on Mars',
      status: 'in-progress',
      priority: 'high',
      startDate: '2024-01-15',
      crewMembers: [1, 2, 3],
    },
    {
      id: 2,
      title: 'Lunar Base Construction',
      description: 'Phase 1 of lunar base construction',
      status: 'pending',
      priority: 'medium',
      startDate: '2024-03-01',
      crewMembers: [4, 5],
    },
    {
      id: 3,
      title: 'Asteroid Mining',
      description: 'Test mining operations on near-Earth asteroid',
      status: 'completed',
      priority: 'high',
      startDate: '2023-11-01',
      endDate: '2024-01-10',
      crewMembers: [1, 3, 5],
    },
  ];

  findAll(): Mission[] {
    return this.missions;
  }

  findOne(id: number): Mission | undefined {
    return this.missions.find((mission) => mission.id === id);
  }

  getStats(): MissionStats {
    const completedMissions = this.missions.filter(
      (m) => m.status === 'completed',
    );
    const inProgressMissions = this.missions.filter(
      (m) => m.status === 'in-progress',
    );
    const totalActiveMissions =
      completedMissions.length + inProgressMissions.length;

    return {
      totalMissions: this.missions.length,
      activeMissions: inProgressMissions.length,
      successRate:
        totalActiveMissions === 0
          ? 0
          : Math.round((completedMissions.length / totalActiveMissions) * 100),
      averageDuration: this.calculateAverageDuration(),
      priorityDistribution: {
        high: this.missions.filter((m) => m.priority === 'high').length,
        medium: this.missions.filter((m) => m.priority === 'medium').length,
        low: this.missions.filter((m) => m.priority === 'low').length,
      },
    };
  }

  private calculateAverageDuration(): number {
    const completedMissions = this.missions.filter(
      (m) => m.status === 'completed' && m.endDate,
    );
    if (completedMissions.length === 0) return 0;

    const totalDuration = completedMissions.reduce((sum, mission) => {
      if (!mission.endDate) return sum;
      const start = new Date(mission.startDate).getTime();
      const end = new Date(mission.endDate).getTime();
      return sum + (end - start);
    }, 0);

    return Math.round(totalDuration / completedMissions.length);
  }
}
