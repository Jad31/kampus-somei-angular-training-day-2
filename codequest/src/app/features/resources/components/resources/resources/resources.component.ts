import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Resource {
  id: string;
  name: string;
  type: 'energy' | 'oxygen' | 'water' | 'food' | 'equipment';
  quantity: number;
  unit: string;
  status: 'sufficient' | 'warning' | 'critical';
  lastUpdate: Date;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent {
  resources: Resource[] = [
    {
      id: '1',
      name: 'Énergie',
      type: 'energy',
      quantity: 85,
      unit: '%',
      status: 'sufficient',
      lastUpdate: new Date()
    },
    {
      id: '2',
      name: 'Oxygène',
      type: 'oxygen',
      quantity: 60,
      unit: '%',
      status: 'warning',
      lastUpdate: new Date()
    },
    {
      id: '3',
      name: 'Nourriture',
      type: 'food',
      quantity: 30,
      unit: 'jours',
      status: 'critical',
      lastUpdate: new Date()
    }
  ];

  getStatusClass(status: Resource['status']): string {
    return `status-${status}`;
  }

  getResourceIcon(type: Resource['type']): string {
    return `icon-${type}`;
  }
}
