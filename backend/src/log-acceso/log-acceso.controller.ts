import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogAccesoService } from './log-acceso.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('log-acceso')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class LogAccesoController {
  constructor(private readonly logAccesoService: LogAccesoService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('usuarioId') usuarioId: number,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ) {
    return this.logAccesoService.findAll({ page, limit, usuarioId, fechaDesde, fechaHasta });
  }
}
