import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Producto, (producto) => producto.lotes)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column()
  producto_id: number;

  @Column({ nullable: true })
  numero_lote: string;

  @Column()
  cantidad_inicial: number;

  @Column()
  cantidad_disponible: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_costo: number;

  @Column({ type: 'date' })
  fecha_compra: Date;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: Date;

  @Column({ type: 'enum', enum: ['ACTIVO', 'AGOTADO', 'VENCIDO'], default: 'ACTIVO' })
  estado: 'ACTIVO' | 'AGOTADO' | 'VENCIDO';
}
