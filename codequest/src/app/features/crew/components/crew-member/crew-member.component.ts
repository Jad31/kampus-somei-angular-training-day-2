import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crew-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crew-member.component.html',
  styleUrls: ['./crew-member.component.scss'],
})
export class CrewMemberComponent {
  @Input() name: string = '';
  @Input() role: string = '';
  @Input() status: 'active' | 'inactive' = 'active';
  @Input() avatar: string = '';
}
