import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Roles('ADMIN', 'RECEPCIONISTA')
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.clientesService.findAll({ page, limit, search });
  }

  @Get(':id/perfil')
  @Roles('ADMIN', 'RECEPCIONISTA')
  findPerfil(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findPerfil(id);
  }

  @Get(':id')
  @Roles('ADMIN', 'RECEPCIONISTA')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'RECEPCIONISTA')
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'RECEPCIONISTA')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Patch(':id/eliminar')
  @Roles('ADMIN', 'RECEPCIONISTA')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }

  @Patch(':id/restaurar')
  @Roles('ADMIN')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.restore(id);
  }
}
