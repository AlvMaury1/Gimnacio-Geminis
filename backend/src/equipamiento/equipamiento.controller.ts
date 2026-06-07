import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { EquipamientoService } from './equipamiento.service';

@UseGuards(JwtAuthGuard)
@Controller('equipamiento')
export class EquipamientoController {
  constructor(private readonly equipamientoService: EquipamientoService) {}

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.equipamientoService.findAll(+page, +limit, search);
  }

  @Get('movimientos')
  findMovimientos(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.equipamientoService.findAllMovimientos(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipamientoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEquipoDto) {
    return this.equipamientoService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEquipoDto) {
    return this.equipamientoService.update(id, dto);
  }

  @Patch(':id/baja')
  darDeBaja(@Param('id', ParseIntPipe) id: number) {
    return this.equipamientoService.darDeBaja(id);
  }

  @Post('movimientos')
  registrarMovimiento(@Body() dto: CreateMovimientoDto) {
    return this.equipamientoService.registrarMovimiento(dto);
  }
}
