import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { CreateMembresiaDto } from './dto/create-membresia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('membresias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembresiasController {
  constructor(private readonly membresiasService: MembresiasService) {}

  @Get()
  @Roles('ADMIN', 'RECEPCIONISTA')
  findAll(
    @Query('clienteId') clienteId: number,
    @Query('estado') estado: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.membresiasService.findAll({ clienteId, estado, page, limit });
  }
  @Get(':id')
  @Roles('ADMIN', 'RECEPCIONISTA')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.findOne(id);
  }
  @Post()
  @Roles('ADMIN', 'RECEPCIONISTA')
  create(@Body() dto: CreateMembresiaDto) {
    return this.membresiasService.create(dto);
  }

  @Patch(':id/cancelar')
  @Roles('ADMIN', 'RECEPCIONISTA')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.cancelar(id);
  }
}
