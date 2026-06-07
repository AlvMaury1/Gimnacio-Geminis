import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membresia } from './membresia.entity';
import { MembresiasService } from './membresias.service';
import { MembresiasController } from './membresias.controller';
import { PlanMembresia } from '../planes-membresia/plan-membresia.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Membresia, PlanMembresia])],
  providers: [MembresiasService],
  controllers: [MembresiasController],
  exports: [MembresiasService],
})
export class MembresiasModule {}
