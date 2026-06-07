import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('planes_membresia')
export class PlanMembresia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  duracion_dias: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ nullable: true })
  descripcion: string;
  @Column({ default: true })
  activo: boolean;
}
