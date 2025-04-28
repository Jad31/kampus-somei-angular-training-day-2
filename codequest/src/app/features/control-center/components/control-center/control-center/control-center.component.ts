import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SystemStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'critical' | 'offline';
  lastCheck: Date;
  components: {
    name: string;
    status: 'ok' | 'warning' | 'error';
  }[];
}

@Component({
  selector: 'app-control-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './control-center.component.html',
  styleUrl: './control-center.component.scss'
})
export class ControlCenterComponent {
  systems: SystemStatus[] = [
    {
      id: '1',
      name: 'Système de Navigation',
      status: 'operational',
      lastCheck: new Date(),
      components: [
        { name: 'GPS', status: 'ok' },
        { name: 'Gyroscope', status: 'ok' },
        { name: 'Accéléromètre', status: 'warning' }
      ]
    },
    {
      id: '2',
      name: 'Système de Support Vie',
      status: 'degraded',
      lastCheck: new Date(),
      components: [
        { name: 'Recyclage Air', status: 'warning' },
        { name: 'Température', status: 'ok' },
        { name: 'Humidité', status: 'error' }
      ]
    },
    {
      id: '3',
      name: 'Système de Communication',
      status: 'critical',
      lastCheck: new Date(),
      components: [
        { name: 'Antenne', status: 'error' },
        { name: 'Transmetteur', status: 'error' },
        { name: 'Récepteur', status: 'warning' }
      ]
    }
  ];

  getStatusClass(status: SystemStatus['status']): string {
    return `status-${status}`;
  }

  getComponentStatusClass(status: 'ok' | 'warning' | 'error'): string {
    return `component-${status}`;
  }
}
