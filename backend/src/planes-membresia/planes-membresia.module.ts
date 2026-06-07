import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanMembresia } from './plan-membresia.entity';
import { Membresia } from '../membresias/membresia.entity';
import { PlanesMembresiaService } from './planes-membresia.service';
import { PlanesMembresiaController } from './planes-membresia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlanMembresia, Membresia])],
  providers: [PlanesMembresiaService],
  controllers: [PlanesMembresiaController],
  exports: [PlanesMembresiaService],
})
export class PlanesMembresiaModule {}
