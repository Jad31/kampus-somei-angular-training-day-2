import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrewListComponent } from './crew-list/crew-list.component';

@Component({
  selector: 'app-crew',
  standalone: true,
  imports: [CommonModule, CrewListComponent],
  templateUrl: './crew.component.html',
  styleUrls: ['./crew.component.scss'],
})
export class CrewComponent {}
