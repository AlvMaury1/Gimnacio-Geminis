import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateLoteDto } from './dto/create-lote.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Lote } from './lote.entity';
import { Producto } from './producto.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Producto)
    private readonly repoProductos: Repository<Producto>,
    @InjectRepository(Lote)
    private readonly repoLotes: Repository<Lote>,
  ) {}

  async findAllProductos(page = 1, limit = 10, search = '') {
    const query = this.repoProductos.createQueryBuilder('producto')
      .addSelect(subQ => subQ
        .select('COALESCE(SUM(l.cantidad_disponible), 0)')
        .from('lotes', 'l')
        .where('l.producto_id = producto.id')
        .andWhere("l.estado = 'ACTIVO'"),
        'stock_total'
      );

    if (search) {
      query.where(
        'producto.nombre ILIKE :search OR producto.codigo_barras ILIKE :search OR producto.marca ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const { entities, raw } = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const data = entities.map((e, i) => ({
      ...e,
      stock_total: Number(raw[i]?.stock_total ?? 0),
    }));

    return { data, total, page, limit };
  }

  async findProductoById(id: number): Promise<Producto> {
    const producto = await this.repoProductos.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async findProductoConLotes(id: number): Promise<Producto> {
    const producto = await this.repoProductos.findOne({
      where: { id },
      relations: ['lotes'],
      order: { lotes: { estado: 'ASC', fecha_compra: 'ASC' } },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async createProducto(dto: CreateProductoDto): Promise<Producto> {
    const existe = await this.repoProductos.findOneBy({ codigo_barras: dto.codigo_barras });
    if (existe) throw new ConflictException('El código de barras ya está registrado');
    const nuevo = this.repoProductos.create(dto);
    return await this.repoProductos.save(nuevo);
  }

  async updateProducto(id: number, dto: UpdateProductoDto): Promise<Producto> {
    await this.findProductoById(id);
    if (dto.codigo_barras) {
      const existe = await this.repoProductos.findOneBy({ codigo_barras: dto.codigo_barras });
      if (existe && existe.id !== id)
        throw new ConflictException('El código de barras ya está registrado');
    }
    await this.repoProductos.update(id, dto);
    return this.findProductoById(id);
  }

  async desactivarProducto(id: number): Promise<void> {
    await this.findProductoById(id);
    const lotesConStock = await this.repoLotes.count({
      where: { producto_id: id, cantidad_disponible: MoreThan(0) },
    });
    if (lotesConStock > 0)
      throw new ConflictException('El producto tiene stock disponible en lotes');
    await this.repoProductos.update(id, { activo: false });
  }

  async findLotesByProducto(productoId: number): Promise<Lote[]> {
    await this.findProductoById(productoId);
    return await this.repoLotes.find({
      where: { producto_id: productoId },
      order: { estado: 'ASC', fecha_compra: 'ASC' },
    });
  }

  async findAllLotes(page = 1, limit = 10): Promise<{ data: any[]; total: number }> {
    const [data, total] = await this.repoLotes.findAndCount({
      relations: ['producto'],
      order: { estado: 'ASC', fecha_compra: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async createLote(dto: CreateLoteDto): Promise<Lote> {
    const producto = await this.findProductoById(dto.producto_id);
    if (producto.tiene_vencimiento && !dto.fecha_vencimiento)
      throw new BadRequestException('Este producto requiere fecha de vencimiento');
    if (!producto.tiene_vencimiento && dto.fecha_vencimiento)
      throw new BadRequestException('Este producto no maneja fecha de vencimiento');
    const lote = this.repoLotes.create({
      ...dto,
      cantidad_disponible: dto.cantidad_inicial,
    });
    return await this.repoLotes.save(lote);
  }

  async calcularStockTotal(productoId: number): Promise<number> {
    const result = await this.repoLotes
      .createQueryBuilder('lote')
      .select('SUM(lote.cantidad_disponible)', 'total')
      .where('lote.producto_id = :productoId', { productoId })
      .andWhere('lote.estado = :estado', { estado: 'ACTIVO' })
      .getRawOne();
    return Number(result?.total ?? 0);
  }
}
