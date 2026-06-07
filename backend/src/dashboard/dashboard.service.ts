import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getStats() {
    const [
      clientesActivos,
      membresiasActivas,
      ventasMes,
      equiposMantenimiento,
      membresiasPorMes,
      clientesPorPlan,
      ingresosPorMes,
      topProductos,
    ] = await Promise.all([
      this.getClientesActivos(),
      this.getMembresiasActivas(),
      this.getVentasMes(),
      this.getEquiposEnMantenimiento(),
      this.getMembresiasPorMes(),
      this.getClientesPorPlan(),
      this.getIngresosPorMes(),
      this.getTopProductos(),
    ]);

    return {
      kpis: { clientesActivos, membresiasActivas, ventasMes, equiposMantenimiento },
      membresiasPorMes,
      clientesPorPlan,
      ingresosPorMes,
      topProductos,
    };
  }

  private async getClientesActivos(): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM clientes WHERE deleted_at IS NULL`,
    );
    return Number(result[0].total);
  }

  private async getMembresiasActivas(): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM membresias WHERE estado = 'ACTIVA'`,
    );
    return Number(result[0].total);
  }

  private async getVentasMes(): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM ventas
       WHERE anulada = false
       AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', NOW())`,
    );
    return Number(result[0].total);
  }

  private async getEquiposEnMantenimiento(): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM equipos_gym WHERE estado = 'EN_MANTENIMIENTO'`,
    );
    return Number(result[0].total);
  }

  private async getMembresiasPorMes(): Promise<{ mes: string; cantidad: number }[]> {
    const result = await this.dataSource.query(
      `SELECT TO_CHAR(fecha_inicio, 'YYYY-MM') as mes, COUNT(*) as cantidad
       FROM membresias
       WHERE fecha_inicio >= NOW() - INTERVAL '6 months'
       GROUP BY mes
       ORDER BY mes ASC`,
    );
    return result.map((r: any) => ({ mes: r.mes, cantidad: Number(r.cantidad) }));
  }

  private async getClientesPorPlan(): Promise<{ plan: string; cantidad: number }[]> {
    const result = await this.dataSource.query(
      `SELECT pm.nombre as plan, COUNT(*) as cantidad
       FROM membresias m
       JOIN planes_membresia pm ON m.plan_membresia_id = pm.id
       WHERE m.estado = 'ACTIVA'
       GROUP BY pm.nombre
       ORDER BY cantidad DESC`,
    );
    return result.map((r: any) => ({ plan: r.plan, cantidad: Number(r.cantidad) }));
  }

  private async getIngresosPorMes(): Promise<{ mes: string; ingresos: number }[]> {
    const result = await this.dataSource.query(
      `SELECT TO_CHAR(fecha, 'YYYY-MM') as mes, COALESCE(SUM(total), 0) as ingresos
       FROM ventas
       WHERE anulada = false
       AND fecha >= NOW() - INTERVAL '6 months'
       GROUP BY mes
       ORDER BY mes ASC`,
    );
    return result.map((r: any) => ({ mes: r.mes, ingresos: Number(r.ingresos) }));
  }

  private async getTopProductos(): Promise<{ producto: string; cantidad: number }[]> {
    const result = await this.dataSource.query(
      `SELECT p.nombre as producto, SUM(vd.cantidad) as cantidad
       FROM ventas_detalle vd
       JOIN lotes l ON vd.lote_id = l.id
       JOIN productos p ON l.producto_id = p.id
       JOIN ventas v ON vd.venta_id = v.id
       WHERE v.anulada = false
       GROUP BY p.nombre
       ORDER BY cantidad DESC
       LIMIT 5`,
    );
    return result.map((r: any) => ({ producto: r.producto, cantidad: Number(r.cantidad) }));
  }
}
