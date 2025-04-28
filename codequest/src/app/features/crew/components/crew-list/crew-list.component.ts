import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrewMemberComponent } from '../crew-member/crew-member.component';

interface CrewMember {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  avatar: string;
}

@Component({
  selector: 'app-crew-list',
  standalone: true,
  imports: [CommonModule, CrewMemberComponent],
  templateUrl: './crew-list.component.html',
  styleUrls: ['./crew-list.component.scss'],
})
export class CrewListComponent {
  crewMembers: CrewMember[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Commandant',
      status: 'active',
      avatar: 'assets/avatars/commander.png',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Ingénieur en chef',
      status: 'active',
      avatar: 'assets/avatars/engineer.png',
    },
    {
      id: 3,
      name: 'Marcus Rodriguez',
      role: 'Scientifique',
      status: 'inactive',
      avatar: 'assets/avatars/scientist.png',
    },
    {
      id: 4,
      name: 'Elena Petrov',
      role: 'Médecin',
      status: 'active',
      avatar: 'assets/avatars/doctor.png',
    },
  ];

  toggleStatus(member: CrewMember) {
    member.status = member.status === 'active' ? 'inactive' : 'active';
  }
}
