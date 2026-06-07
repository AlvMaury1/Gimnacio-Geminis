import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('log_acceso')
export class LogAcceso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column()
  usuario_id: number;

  @Column()
  ip: string;

  @Column({ type: 'enum', enum: ['INGRESO', 'SALIDA'] })
  evento: string;

  @Column()
  browser: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fecha_hora: Date;
}
