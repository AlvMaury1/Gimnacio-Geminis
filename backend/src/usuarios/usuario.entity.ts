import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'RECEPCIONISTA'] })
  rol: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ default: 0 })
  intentos_fallidos: number;

  @Column({ type: 'timestamp', nullable: true })
  bloqueado_hasta: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;
}
