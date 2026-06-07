import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../clientes/cliente.entity';
import { VentaDetalle } from './venta-detalle.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column()
  cliente_id: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: ['EFECTIVO', 'QR', 'TARJETA'] })
  tipo_pago: 'EFECTIVO' | 'QR' | 'TARJETA';

  @Column({ default: false })
  anulada: boolean;

  @OneToMany(() => VentaDetalle, (detalle) => detalle.venta)
  detalles: VentaDetalle[];
}
