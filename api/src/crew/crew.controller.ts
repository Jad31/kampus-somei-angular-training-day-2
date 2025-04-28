import { Controller, Get, Param } from '@nestjs/common';
import { CrewService } from './crew.service';
import { CrewMember } from './interfaces/crew.interface';

@Controller('crew')
export class CrewController {
  constructor(private readonly crewService: CrewService) {}

  @Get()
  findAll(): CrewMember[] {
    return this.crewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): CrewMember | undefined {
    return this.crewService.findOne(+id);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: 'active' | 'inactive'): CrewMember[] {
    return this.crewService.findByStatus(status);
  }

  @Get('mission/:missionId')
  findByMission(@Param('missionId') missionId: string): CrewMember[] {
    return this.crewService.findByMission(+missionId);
  }
}
