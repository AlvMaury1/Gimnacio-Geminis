import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAcceso } from './log-acceso.entity';

@Injectable()
export class LogAccesoService {
  constructor(
    @InjectRepository(LogAcceso)
    private readonly repo: Repository<LogAcceso>,
  ) {}

  registrar(data: {
    usuario_id: number;
    ip: string;
    evento: 'INGRESO' | 'SALIDA';
    browser: string;
  }) {
    // setImmediate evita que el guardado bloquee la respuesta del login
    setImmediate(() => {
      this.repo.save(this.repo.create(data));
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    usuarioId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const qb = this.repo
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.usuario', 'usuario')
      .orderBy('log.fecha_hora', 'DESC');

    if (query.usuarioId) {
      qb.andWhere('log.usuario_id = :usuarioId', { usuarioId: query.usuarioId });
    }
    if (query.fechaDesde) {
      qb.andWhere('log.fecha_hora >= :fechaDesde', { fechaDesde: query.fechaDesde });
    }
    if (query.fechaHasta) {
      qb.andWhere('log.fecha_hora <= :fechaHasta', { fechaHasta: query.fechaHasta });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }
}
