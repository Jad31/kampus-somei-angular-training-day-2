import { Module } from '@nestjs/common';
import { CrewController } from './crew.controller';
import { CrewService } from './crew.service';

@Module({
  controllers: [CrewController],
  providers: [CrewService],
})
export class CrewModule {}
