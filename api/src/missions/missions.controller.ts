import { Controller, Get, Param } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { Mission, MissionStats } from './interfaces/mission.interface';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  findAll(): Mission[] {
    return this.missionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Mission | undefined {
    return this.missionsService.findOne(+id);
  }

  @Get('stats')
  getStats(): MissionStats {
    return this.missionsService.getStats();
  }
}
