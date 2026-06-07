import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class ReportesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  private createDoc(): any {
    return new PDFDocument({ margin: 40, size: 'A4' });
  }

  private finalize(doc: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      doc.end();
    });
  }

  private header(doc: any, titulo: string): void {
    doc.font('Helvetica-Bold').fontSize(16).text('Gimnacion Geminis — Sistema de Gestión de Gimnasio');
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#444').text(titulo);
    doc.font('Helvetica').fontSize(9).fillColor('#888')
      .text(`Generado: ${new Date().toLocaleDateString('es-BO')}`);
    doc.fillColor('#000').moveTo(40, doc.y + 4).lineTo(555, doc.y + 4).stroke();
    doc.moveDown(0.8);
  }

  private drawTable(doc: any, headers: string[], widths: number[], rows: any[][]): void {
    const startX = 40;
    let y = doc.y;
    const rowH = 35;

    // header row
    doc.rect(startX, y, widths.reduce((a, b) => a + b, 0), rowH).fill('#1a73e8');
    let x = startX;
    headers.forEach((h, i) => {
      doc.font('Helvetica-Bold').fontSize(9).fillColor('white')
        .text(h, x + 4, y + 4, { width: widths[i] - 8, ellipsis: true });
      x += widths[i];
    });
    y += rowH;

    // data rows
    rows.forEach((row, ri) => {
      const fill = ri % 2 === 0 ? '#f5f5f5' : '#ffffff';
      doc.rect(startX, y, widths.reduce((a, b) => a + b, 0), rowH).fill(fill);
      x = startX;
      row.forEach((cell: any, i: number) => {
        const text = cell?.text ?? String(cell ?? '');
        const color = cell?.color ?? '#000000';
        doc.font( 'Helvetica').fontSize(9).fillColor(color)
          .text(text, x + 4, y + 4, { width: widths[i] - 8, ellipsis: true });
        x += widths[i];
      });
      y += rowH;

      // new page if needed
      if (y > 760) {
        doc.addPage();
        y = 40;
      }
    });

    doc.fillColor('#000').y = y + 8;
    doc.moveDown(0.5);
  }

  async generarMembresias(
    fechaDesde?: string,
    fechaHasta?: string,
    estado?: string,
    planId?: number,
  ): Promise<Buffer> {
    let query = `
      SELECT c.nombre || ' ' || c.apellido as cliente, pm.nombre as plan,
             m.fecha_inicio, m.fecha_fin, m.precio_pagado, m.estado
      FROM membresias m
      JOIN clientes c ON m.cliente_id = c.id
      JOIN planes_membresia pm ON m.plan_membresia_id = pm.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;
    if (fechaDesde) { query += ` AND m.fecha_inicio >= $${i++}::date`; params.push(fechaDesde); }
    if (fechaHasta) { query += ` AND m.fecha_inicio <= $${i++}::date`; params.push(fechaHasta); }
    if (estado) { query += ` AND m.estado = $${i++}`; params.push(estado); }
    if (planId) { query += ` AND m.plan_membresia_id = $${i++}`; params.push(planId); }
    query += ' ORDER BY m.fecha_inicio DESC';

    const rows = await this.dataSource.query(query, params);
    const total = rows.reduce((sum: number, r: any) => sum + Number(r.precio_pagado), 0);

    const doc = this.createDoc();
    this.header(doc, 'Reporte de Membresías');

    this.drawTable(
      doc,
      ['Cliente', 'Plan', 'Inicio', 'Fin', 'Precio', 'Estado'],
      [130, 100, 70, 70, 70, 75],
      rows.map((r: any) => [
        r.cliente, r.plan,
        new Date(r.fecha_inicio).toLocaleDateString('es-BO'),
        new Date(r.fecha_fin).toLocaleDateString('es-BO'),
        `Bs. ${Number(r.precio_pagado).toFixed(2)}`,
        r.estado,
      ]),
    );

    doc.font('Helvetica-Bold').fontSize(10)
      .text(`Total: Bs. ${total.toFixed(2)}`, { align: 'right' });

    return this.finalize(doc);
  }

  async generarVentas(fechaDesde?: string, fechaHasta?: string): Promise<Buffer> {
    let query = `
      SELECT v.id, c.nombre || ' ' || c.apellido as cliente, v.fecha,
             v.total, v.tipo_pago, v.anulada
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;
    if (fechaDesde) { query += ` AND date(v.fecha) >= $${i++}::date`; params.push(fechaDesde); }
    if (fechaHasta) { query += ` AND date(v.fecha) <= $${i++}::date`; params.push(fechaHasta); }
    query += ' ORDER BY v.fecha DESC';

    const rows = await this.dataSource.query(query, params);
    const totalGeneral = rows
      .filter((r: any) => !r.anulada)
      .reduce((sum: number, r: any) => sum + Number(r.total), 0);

    const doc = this.createDoc();
    this.header(doc, 'Reporte de Ventas');

    this.drawTable(
      doc,
      ['#', 'Cliente', 'Fecha', 'Total', 'Pago', 'Estado'],
      [30, 150, 70, 70, 70, 65],
      rows.map((r: any) => [
        String(r.id), r.cliente,
        new Date(r.fecha).toLocaleDateString('es-BO'),
        `Bs. ${Number(r.total).toFixed(2)}`,
        r.tipo_pago,
        { text: r.anulada ? 'ANULADA' : 'VÁLIDA', color: r.anulada ? 'red' : 'green' },
      ]),
    );

    doc.font('Helvetica-Bold').fontSize(10)
      .text(`Total ventas válidas: Bs. ${totalGeneral.toFixed(2)}`, { align: 'right' });

    return this.finalize(doc);
  }

  async generarInventario(): Promise<Buffer> {
    const rows = await this.dataSource.query(`
      SELECT p.nombre, p.codigo_barras, p.categoria,
             COALESCE(SUM(l.cantidad_disponible), 0) as stock_total,
             p.stock_minimo, p.precio_venta
      FROM productos p
      LEFT JOIN lotes l ON l.producto_id = p.id AND l.estado = 'ACTIVO'
      WHERE p.activo = true
      GROUP BY p.id, p.nombre, p.codigo_barras, p.categoria, p.stock_minimo, p.precio_venta
      ORDER BY p.nombre ASC
    `);

    const doc = this.createDoc();
    this.header(doc, 'Reporte de Inventario');

    this.drawTable(
      doc,
      ['Producto', 'Código', 'Categoría', 'Stock', 'Mín.', 'Precio'],
      [140, 80, 80, 50, 50, 75],
      rows.map((r: any) => {
        const stockBajo = Number(r.stock_total) <= Number(r.stock_minimo);
        return [
          r.nombre, r.codigo_barras, r.categoria ?? '-',
          { text: String(r.stock_total), color: stockBajo ? 'red' : 'black', bold: stockBajo },
          String(r.stock_minimo),
          `Bs. ${Number(r.precio_venta).toFixed(2)}`,
        ];
      }),
    );

    return this.finalize(doc);
  }

  async generarLogAcceso(fechaDesde?: string, fechaHasta?: string): Promise<Buffer> {
    let query = `
      SELECT u.email, la.evento, la.ip, la.browser, la.fecha_hora
      FROM log_acceso la
      JOIN usuarios u ON la.usuario_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;
    if (fechaDesde) { query += ` AND date(la.fecha_hora) >= $${i++}::date`; params.push(fechaDesde); }
    if (fechaHasta) { query += ` AND date(la.fecha_hora) <= $${i++}::date`; params.push(fechaHasta); }
    query += ' ORDER BY la.fecha_hora DESC';

    const rows = await this.dataSource.query(query, params);

    const doc = this.createDoc();
    this.header(doc, 'Reporte de Log de Acceso');

    this.drawTable(
      doc,
      ['Usuario', 'Evento', 'IP', 'Browser', 'Fecha/Hora'],
      [150, 60, 80, 110, 115],
      rows.map((r: any) => [
        r.email, r.evento, r.ip, r.browser ?? '-',
        new Date(r.fecha_hora).toLocaleString('es-BO'),
      ]),
    );

    return this.finalize(doc);
  }
}
