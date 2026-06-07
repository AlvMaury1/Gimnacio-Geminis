import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membresia } from '../membresias/membresia.entity';
import { CreatePlanMembresiaDto } from './dto/create-plan-membresia.dto';
import { UpdatePlanMembresiaDto } from './dto/update-plan-membresia.dto';
import { PlanMembresia } from './plan-membresia.entity';

@Injectable()
export class PlanesMembresiaService {
  constructor(
    @InjectRepository(PlanMembresia)
    private readonly repoPlanMembresia: Repository<PlanMembresia>,
    @InjectRepository(Membresia)
    private readonly repoMembresias: Repository<Membresia>,
  ) {}

  async findAll() {
    return this.repoPlanMembresia.find({where: { activo: true }});
  }

  async findOne(id: number) {
    const plan = await this.repoPlanMembresia.findOneBy({ id });
    if(!plan)
    {
      throw new NotFoundException('Plan de membresía no encontrado');
    }
    return plan;
  }

  async create(dto: CreatePlanMembresiaDto) {
    
    const nuevoPlan = this.repoPlanMembresia.create(dto);
    return await this.repoPlanMembresia.save(nuevoPlan);

  }

  async update(id: number, dto: UpdatePlanMembresiaDto) {
    await this.findOne(id);
    return await this.repoPlanMembresia.update(id, dto);
  }

  async desactivar(id: number) {
    await this.findOne(id);

    const membresiaActiva = await this.repoMembresias.findOne({
      where: { plan_membresia_id: id, estado: 'ACTIVA' },
    });
    if (membresiaActiva) {
      throw new ConflictException('No se puede desactivar un plan con membresías activas');
    }

    return this.repoPlanMembresia.update(id, { activo: false });
  }
}
