import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lote } from './lote.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ unique: true })
  codigo_barras: string;

  @Column({ nullable: true })
  categoria: string;

  @Column({ nullable: true })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_venta: number;

  @Column({ default: 5 })
  stock_minimo: number;

  @Column({ default: false })
  tiene_vencimiento: boolean;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Lote, (lote) => lote.producto)
  lotes: Lote[];
}
