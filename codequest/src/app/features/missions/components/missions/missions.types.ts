export type MissionStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export type MissionPriority = 'low' | 'medium' | 'high';

export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  priority: MissionPriority;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface MissionStats {
  totalMissions: number;
  activeMissions: number;
  lastUpdate: Date;
}