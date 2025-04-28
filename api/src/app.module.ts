import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MissionsModule } from './missions/missions.module';
import { CrewModule } from './crew/crew.module';

@Module({
  imports: [MissionsModule, CrewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
