import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MissionsService } from './missions.service';
import { Mission, MissionPriority, MissionStats } from './missions.types';

interface MissionForm {
  name: FormControl<string>;
  priority: FormControl<MissionPriority>;
  startDate: FormControl<Date>;
  description: FormControl<string | null>;
}

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
})
export class MissionsComponent implements OnInit {
  missions: Mission[] = [];
  missionStats: MissionStats = {
    totalMissions: 0,
    activeMissions: 0,
    successRate: 0,
    averageDuration: 0,
    lastUpdate: new Date(),
    priorityDistribution: {
      high: 0,
      medium: 0,
      low: 0,
    },
  };
  showNewMissionForm = false;
  missionForm: FormGroup<MissionForm>;
  isLoading = true;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private missionsService = inject(MissionsService);

  constructor() {
    this.missionForm = this.fb.group<MissionForm>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      priority: new FormControl('medium', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      startDate: new FormControl(new Date(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        validators: [Validators.maxLength(500)],
      }),
    });
  }

  ngOnInit() {
    this.loadMissions();
    this.loadMissionStats();
  }

  loadMissions() {
    this.isLoading = true;
    this.error = null;
    this.missionsService.getAllMissions().subscribe({
      next: (missions) => {
        this.missions = missions;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load missions. Please try again later.';
        this.isLoading = false;
        console.error('Error loading missions:', err);
      },
    });
  }

  private loadMissionStats() {
    this.missionsService.getMissionStats().subscribe({
      next: (stats) => {
        this.missionStats = stats;
      },
      error: (err) => {
        console.error('Error loading mission stats:', err);
      },
    });
  }

  toggleNewMissionForm(): void {
    this.showNewMissionForm = !this.showNewMissionForm;
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
      activeMissions: this.missions.filter((m) => m.status === 'in-progress')
        .length,
      successRate: this.getSuccessRate(),
      averageDuration: this.getAverageDuration(),
      lastUpdate: new Date(),
      priorityDistribution: this.getPriorityDistribution(),
    };
  }

  getMissionDuration(mission: Mission): number {
    if (!mission.endDate) return 0;
    const endDate = new Date(mission.endDate);
    const startDate = new Date(mission.startDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSuccessRate(): number {
    const completedMissions = this.missions.filter(
      (m) => m.status === 'completed',
    ).length;
    return Math.round((completedMissions / this.missions.length) * 100);
  }

  getAverageDuration(): number {
    const completedMissions = this.missions.filter(
      (m) => m.status === 'completed' && m.endDate,
    );
    if (completedMissions.length === 0) return 0;

    const totalDuration = completedMissions.reduce((sum, mission) => {
      return sum + this.getMissionDuration(mission);
    }, 0);

    return Math.round(totalDuration / completedMissions.length);
  }

  getPriorityDistribution(): { high: number; medium: number; low: number } {
    return {
      high: this.missions.filter((m) => m.priority === 'high').length,
      medium: this.missions.filter((m) => m.priority === 'medium').length,
      low: this.missions.filter((m) => m.priority === 'low').length,
    };
  }

  getEfficiencyRate(): number {
    const completedMissions = this.missions.filter(
      (m) => m.status === 'completed',
    ).length;
    const inProgressMissions = this.missions.filter(
      (m) => m.status === 'in-progress',
    ).length;
    const totalActiveMissions = completedMissions + inProgressMissions;

    if (totalActiveMissions === 0) return 0;
    return Math.round((completedMissions / totalActiveMissions) * 100);
  }

  onSubmit(): void {
    if (this.missionForm.valid) {
      const newMission: Mission = {
        id: Date.now().toString(),
        name: this.missionForm.value.name!,
        status: 'pending',
        priority: this.missionForm.value.priority!,
        startDate: this.missionForm.value.startDate!,
        description: this.missionForm.value.description || undefined,
      };

      this.missions.push(newMission);
      this.missionForm.reset();
      this.showNewMissionForm = false;
      this.updateMissionStats();
    }
  }

  getFormControl(name: keyof MissionForm): FormControl {
    return this.missionForm.get(name) as FormControl;
  }
}
