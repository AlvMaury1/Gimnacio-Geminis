import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamientoController } from './equipamiento.controller';
import { EquipamientoService } from './equipamiento.service';
import { EquipoGym } from './equipo-gym.entity';
import { MovimientoEquipo } from './movimiento-equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipoGym, MovimientoEquipo])],
  controllers: [EquipamientoController],
  providers: [EquipamientoService],
})
export class EquipamientoModule {}
