import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membresia } from '../membresias/membresia.entity';
import { Venta } from '../ventas/venta.entity';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repoClientes: Repository<Cliente>,
    @InjectRepository(Membresia)
    private readonly repoMembresias: Repository<Membresia>,
    @InjectRepository(Venta)
    private readonly repoVentas: Repository<Venta>,
  ) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const qb = this.repoClientes
      .createQueryBuilder('cliente')
      .orderBy('cliente.fecha_registro', 'DESC');

    if (query.search) {
      qb.where(
        'cliente.nombre ILIKE :search OR cliente.apellido ILIKE :search OR cliente.email ILIKE :search',
        { search: `%${query.search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.repoClientes.findOneBy({ id });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const existe = await this.repoClientes.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException('El email ya está registrado');
    return await this.repoClientes.save(this.repoClientes.create(dto));
  }

  async update(id: number, dto: UpdateClienteDto) {
    await this.findOne(id);
    return await this.repoClientes.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.repoClientes.softDelete(id);
  }

  async restore(id: number) {
    const cliente = await this.repoClientes.findOne({ where: { id }, withDeleted: true });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return await this.repoClientes.restore(id);
  }

  async findPerfil(id: number) {
    const cliente = await this.findOne(id);

    const membresia = await this.repoMembresias.findOne({
      where: { cliente_id: id, estado: 'ACTIVA' },
      relations: ['plan'],
      order: { fecha_fin: 'DESC' },
    });

    let membresiaData: { id: number; estado: string; fecha_inicio: Date; fecha_fin: Date; diasRestantes: number; planNombre: string } | null = null;
    if (membresia) {
      const diasRestantes = Math.ceil(
        (new Date(membresia.fecha_fin).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      membresiaData = {
        id: membresia.id,
        estado: membresia.estado,
        fecha_inicio: membresia.fecha_inicio,
        fecha_fin: membresia.fecha_fin,
        diasRestantes,
        planNombre: membresia.plan?.nombre || 'N/A',
      };
    }

    const ultimasVentas = await this.repoVentas.find({
      where: { cliente_id: id },
      order: { fecha: 'DESC' },
      take: 5,
      select: ['id', 'fecha', 'total', 'tipo_pago'],
    });

    return { cliente, membresia: membresiaData, ultimasVentas };
  }
}
