import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PlanesMembresiaService } from './planes-membresia.service';
import { CreatePlanMembresiaDto } from './dto/create-plan-membresia.dto';
import { UpdatePlanMembresiaDto } from './dto/update-plan-membresia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('planes-membresia')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanesMembresiaController {
  constructor(private readonly service: PlanesMembresiaService) {}

  @Get()
  @Roles('ADMIN', 'RECEPCIONISTA')
  findAll() {
      return this.service.findAll();
  }
  @Get(':id')
  @Roles('ADMIN', 'RECEPCIONISTA')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreatePlanMembresiaDto) {
      return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlanMembresiaDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/desactivar')
  @Roles('ADMIN')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.service.desactivar(id);
  }
}
