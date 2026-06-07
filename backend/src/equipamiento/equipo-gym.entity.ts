import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovimientoEquipo } from './movimiento-equipo.entity';

@Entity('equipos_gym')
export class EquipoGym {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  variante: string;

  @Column()
  cantidad_total: number;

  @Column()
  cantidad_disponible: number;

  @Column({ nullable: true })
  numero_serie: string;

  @Column({ type: 'enum', enum: ['DISPONIBLE', 'EN_MANTENIMIENTO', 'BAJA'], default: 'DISPONIBLE' })
  estado: 'DISPONIBLE' | 'EN_MANTENIMIENTO' | 'BAJA';

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ type: 'date', nullable: true })
  fecha_adquisicion: Date;

  @Column({ type: 'date', nullable: true })
  proximo_mantenimiento: Date;

  @OneToMany(() => MovimientoEquipo, (mov) => mov.equipo)
  movimientos: MovimientoEquipo[];
}
