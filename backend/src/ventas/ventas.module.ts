import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioModule } from '../inventario/inventario.module';
import { Lote } from '../inventario/lote.entity';
import { VentaDetalle } from './venta-detalle.entity';
import { Venta } from './venta.entity';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, VentaDetalle, Lote]),
    InventarioModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
