import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EquipoGym } from './equipo-gym.entity';

@Entity('movimientos_equipo')
export class MovimientoEquipo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => EquipoGym, (equipo) => equipo.movimientos)
  @JoinColumn({ name: 'equipo_id' })
  equipo: EquipoGym;

  @Column()
  equipo_id: number;

  @Column({ type: 'enum', enum: ['RETIRO', 'RETORNO'] })
  tipo: 'RETIRO' | 'RETORNO';

  @Column()
  cantidad: number;

  @Column({ nullable: true })
  motivo: string;

  @Column({ nullable: true })
  numero_factura: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fecha: Date;

  @Column({ type: 'date', nullable: true })
  fecha_estimada_retorno: Date;
}
