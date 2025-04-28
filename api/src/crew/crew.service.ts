import { Injectable } from '@nestjs/common';
import { CrewMember } from './interfaces/crew.interface';

@Injectable()
export class CrewService {
  private crewMembers: CrewMember[] = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Commander',
      status: 'active',
      specialization: 'Navigation',
      missions: [1, 3],
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Engineer',
      status: 'active',
      specialization: 'Systems',
      missions: [1],
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Scientist',
      status: 'active',
      specialization: 'Research',
      missions: [1, 3],
    },
    {
      id: 4,
      name: 'Emma Wilson',
      role: 'Pilot',
      status: 'inactive',
      specialization: 'Flight Operations',
      missions: [2],
    },
    {
      id: 5,
      name: 'David Brown',
      role: 'Engineer',
      status: 'active',
      specialization: 'Construction',
      missions: [2, 3],
    },
  ];

  findAll(): CrewMember[] {
    return this.crewMembers;
  }

  findOne(id: number): CrewMember | undefined {
    return this.crewMembers.find((member) => member.id === id);
  }

  findByStatus(status: 'active' | 'inactive'): CrewMember[] {
    return this.crewMembers.filter((member) => member.status === status);
  }

  findByMission(missionId: number): CrewMember[] {
    return this.crewMembers.filter((member) =>
      member.missions.includes(missionId),
    );
  }
}
