export type MissionStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type MissionPriority = 'high' | 'medium' | 'low';

export interface Mission {
  id: number;
  title: string;
  description: string;
  status: MissionStatus;
  priority: MissionPriority;
  startDate: string;
  endDate?: string;
  crewMembers: number[];
}

export interface MissionStats {
  totalMissions: number;
  activeMissions: number;
  successRate: number;
  averageDuration: number;
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}
