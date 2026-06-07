import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InventarioService } from '../inventario/inventario.service';
import { Lote } from '../inventario/lote.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { VentaDetalle } from './venta-detalle.entity';
import { Venta } from './venta.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly repoVentas: Repository<Venta>,
    @InjectRepository(VentaDetalle)
    private readonly repoDetalle: Repository<VentaDetalle>,
    @InjectRepository(Lote)
    private readonly repoLotes: Repository<Lote>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly inventarioService: InventarioService,
  ) {}

  async findAll(page = 1, limit = 10, clienteId?: number, fechaDesde?: string, fechaHasta?: string) {
    const query = this.repoVentas
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('detalles.lote', 'lote')
      .leftJoinAndSelect('lote.producto', 'producto');

    if (clienteId) query.andWhere('venta.cliente_id = :clienteId', { clienteId });
    if (fechaDesde) query.andWhere('venta.fecha >= :fechaDesde', { fechaDesde });
    if (fechaHasta) query.andWhere('venta.fecha <= :fechaHasta', { fechaHasta });

    const [data, total] = await query
      .orderBy('venta.fecha', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.repoVentas.findOne({
      where: { id },
      relations: ['cliente', 'detalles', 'detalles.lote', 'detalles.lote.producto'],
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  async create(dto: CreateVentaDto): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;
      const detalles: Partial<VentaDetalle>[] = [];

      for (const item of dto.items) {
        const producto = await this.inventarioService.findProductoById(item.producto_id);
        const stockTotal = await this.inventarioService.calcularStockTotal(item.producto_id);

        if (stockTotal < item.cantidad)
          throw new BadRequestException(`Stock insuficiente para "${producto.nombre}"`);

        let cantidadPendiente = item.cantidad;

        const lotes = await queryRunner.manager.find(Lote, {
          where: { producto_id: item.producto_id, estado: 'ACTIVO' },
          order: { fecha_compra: 'ASC' },
        });

        for (const lote of lotes) {
          if (cantidadPendiente === 0) break;

          const cantidadUsada = Math.min(lote.cantidad_disponible, cantidadPendiente);
          const subtotal = cantidadUsada * Number(producto.precio_venta);

          detalles.push({
            lote_id: lote.id,
            cantidad: cantidadUsada,
            precio_unitario: Number(producto.precio_venta),
            subtotal,
          });

          total += subtotal;
          cantidadPendiente -= cantidadUsada;

          lote.cantidad_disponible -= cantidadUsada;
          if (lote.cantidad_disponible === 0) lote.estado = 'AGOTADO';

          await queryRunner.manager.save(Lote, lote);
        }
      }

      const venta = queryRunner.manager.create(Venta, {
        cliente_id: dto.cliente_id,
        tipo_pago: dto.tipo_pago,
        total,
      });
      const ventaGuardada = await queryRunner.manager.save(Venta, venta);

      for (const detalle of detalles) {
        const d = queryRunner.manager.create(VentaDetalle, {
          ...detalle,
          venta_id: ventaGuardada.id,
        });
        await queryRunner.manager.save(VentaDetalle, d);
      }

      await queryRunner.commitTransaction();
      return this.findOne(ventaGuardada.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async anular(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const venta = await this.findOne(id);

      if (venta.anulada) throw new BadRequestException('La venta ya está anulada');

      for (const detalle of venta.detalles) {
        const lote = await queryRunner.manager.findOneByOrFail(Lote, { id: detalle.lote_id });
        lote.cantidad_disponible += detalle.cantidad;
        lote.estado = 'ACTIVO';
        await queryRunner.manager.save(Lote, lote);
      }

      await queryRunner.manager.update(Venta, id, { anulada: true });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
