import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { EquipoGym } from './equipo-gym.entity';
import { MovimientoEquipo } from './movimiento-equipo.entity';

@Injectable()
export class EquipamientoService {
  constructor(
    @InjectRepository(EquipoGym)
    private readonly repoEquipos: Repository<EquipoGym>,
    @InjectRepository(MovimientoEquipo)
    private readonly repoMovimientos: Repository<MovimientoEquipo>,
  ) {}

  async findAllMovimientos(page = 1, limit = 10) {
    const [data, total] = await this.repoMovimientos.findAndCount({
      relations: ['equipo'],
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const query = this.repoEquipos.createQueryBuilder('equipo');
    if (search) {
      query.where('equipo.nombre ILIKE :search', { search: `%${search}%` });
    }
    const hoy = new Date();
    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);

    const [equipos, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = equipos.map((e) => ({
      ...e,
      alerta_mantenimiento:
        e.proximo_mantenimiento != null && new Date(e.proximo_mantenimiento) <= en7Dias,
    }));

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<EquipoGym & { alerta_mantenimiento: boolean }> {
    const equipo = await this.repoEquipos.findOne({
      where: { id },
      relations: ['movimientos'],
      order: { movimientos: { fecha: 'DESC' } },
    });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');
    const en7Dias = new Date();
    en7Dias.setDate(en7Dias.getDate() + 7);
    return {
      ...equipo,
      alerta_mantenimiento:
        equipo.proximo_mantenimiento != null && new Date(equipo.proximo_mantenimiento) <= en7Dias,
    };
  }

  async findEquipoById(id: number): Promise<EquipoGym> {
    const equipo = await this.repoEquipos.findOneBy({ id });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');
    return equipo;
  }

  async create(dto: CreateEquipoDto): Promise<EquipoGym> {
    const equipo = this.repoEquipos.create({
      ...dto,
      cantidad_disponible: dto.cantidad_total,
    });
    return await this.repoEquipos.save(equipo);
  }

  async update(id: number, dto: UpdateEquipoDto): Promise<EquipoGym> {
    await this.findEquipoById(id);
    await this.repoEquipos.update(id, dto);
    return this.findEquipoById(id);
  }

  async darDeBaja(id: number): Promise<void> {
    const equipo = await this.findEquipoById(id);
    if (equipo.estado === 'BAJA')
      throw new ConflictException('El equipo ya está dado de baja');
    await this.repoEquipos.update(id, { estado: 'BAJA' });
  }

  async registrarMovimiento(dto: CreateMovimientoDto): Promise<MovimientoEquipo> {
    const equipo = await this.findEquipoById(dto.equipo_id);

    if (equipo.estado === 'BAJA')
      throw new BadRequestException('No se pueden registrar movimientos en un equipo dado de baja');

    if (dto.tipo === 'RETIRO') {
      if (equipo.cantidad_disponible < dto.cantidad)
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${equipo.cantidad_disponible}`,
        );
      equipo.cantidad_disponible -= dto.cantidad;
      if (equipo.cantidad_disponible < equipo.cantidad_total) {
        equipo.estado = 'EN_MANTENIMIENTO';
      }
    } else {
      equipo.cantidad_disponible = Math.min(
        equipo.cantidad_disponible + dto.cantidad,
        equipo.cantidad_total,
      );
      if (equipo.cantidad_disponible === equipo.cantidad_total) {
        equipo.estado = 'DISPONIBLE';
      }
    }

    await this.repoEquipos.save(equipo);
    const movimiento = this.repoMovimientos.create({ ...dto, equipo_id: equipo.id });
    return await this.repoMovimientos.save(movimiento);
  }
}
