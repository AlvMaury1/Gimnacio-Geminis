import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAcceso } from './log-acceso.entity';
import { LogAccesoService } from './log-acceso.service';
import { LogAccesoController } from './log-acceso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogAcceso])],
  providers: [LogAccesoService],
  exports: [LogAccesoService],
  controllers: [LogAccesoController],
})
export class LogAccesoModule {}
