import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportesService } from './reportes.service';

@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('membresias')
  async membresias(
    @Res() res: Response,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('estado') estado?: string,
    @Query('planId') planId?: string,
  ) {
    const buffer = await this.reportesService.generarMembresias(
      fechaDesde, fechaHasta, estado, planId ? +planId : undefined,
    );
    const fecha = new Date().toISOString().split('T')[0];
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="membresias_${fecha}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('ventas')
  async ventas(
    @Res() res: Response,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    const buffer = await this.reportesService.generarVentas(fechaDesde, fechaHasta);
    const fecha = new Date().toISOString().split('T')[0];
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ventas_${fecha}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('inventario')
  async inventario(@Res() res: Response) {
    const buffer = await this.reportesService.generarInventario();
    const fecha = new Date().toISOString().split('T')[0];
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="inventario_${fecha}.pdf"`,
    });
    res.send(buffer);
  }

  @Get('log-acceso')
  async logAcceso(
    @Res() res: Response,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    const buffer = await this.reportesService.generarLogAcceso(fechaDesde, fechaHasta);
    const fecha = new Date().toISOString().split('T')[0];
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="log_acceso_${fecha}.pdf"`,
    });
    res.send(buffer);
  }
}
