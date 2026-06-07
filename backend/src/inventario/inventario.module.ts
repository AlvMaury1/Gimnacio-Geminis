import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { Lote } from './lote.entity';
import { Producto } from './producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Lote])],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
