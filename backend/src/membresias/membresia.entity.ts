import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { PlanMembresia } from '../planes-membresia/plan-membresia.entity';

@Entity('membresias')
export class Membresia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column()
  cliente_id: number;

  @ManyToOne(() => PlanMembresia)
  @JoinColumn({ name: 'plan_membresia_id' })
  plan: PlanMembresia;

  @Column()
  plan_membresia_id: number;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_pagado: number;

  @Column({ type: 'enum', enum: ['ACTIVA', 'VENCIDA', 'CANCELADA'], default: 'ACTIVA' })
  estado: string;
}
