import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanMembresia } from '../planes-membresia/plan-membresia.entity';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { Membresia } from './membresia.entity';

@Injectable()
export class MembresiasService {
  constructor(
    @InjectRepository(Membresia)
    private readonly repoMembresias: Repository<Membresia>,
    @InjectRepository(PlanMembresia)
    private readonly repoPlanMembresias: Repository<PlanMembresia>,
  ) {}

  async findAll(query: { clienteId?: number; estado?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const qb = this.repoMembresias
      .createQueryBuilder('membresia')
      .leftJoinAndSelect('membresia.cliente', 'cliente')
      .leftJoinAndSelect('membresia.plan', 'plan')
      .orderBy('membresia.fecha_inicio', 'DESC');

    if (query.clienteId) {
      qb.where('membresia.cliente_id = :clienteId', { clienteId: query.clienteId });
    }

    if (query.estado) {
      qb.andWhere('membresia.estado = :estado', { estado: query.estado });
    }

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total, page, limit };
    // TODO
  }
  async findOne(id: number) {
    const membresia = await this.repoMembresias.findOneBy({ id });
    if (!membresia) {
      throw new NotFoundException('Membresía no encontrada');
    }
    return membresia;
  }
  async create(dto: CreateMembresiaDto) 
  {
    const plan = await this.repoPlanMembresias.findOneBy({ id: dto.plan_membresia_id });
    if (!plan || !plan.activo) {
      throw new NotFoundException('Plan de membresía no encontrado');
    }
    const fecha_inicio = new Date(dto.fecha_inicio);
    const fecha_fin = new Date(fecha_inicio);
    fecha_fin.setDate(fecha_fin.getDate() + plan.duracion_dias);
    return this.repoMembresias.save(
      {
        ...dto,
        fecha_fin,
        precio_pagado: plan.precio,
      }
    )
    // TODO: buscar el plan, calcular fecha_fin, guardar
  }

  async cancelar(id: number) {
    await this.findOne(id);
    return this.repoMembresias.update(id, { estado: 'CANCELADA' });
    // TODO: cambiar estado a CANCELADA
  }
}
