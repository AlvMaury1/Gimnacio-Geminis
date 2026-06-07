import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { AuthModule } from './auth/auth.module';
import { LogAccesoModule } from './log-acceso/log-acceso.module';
import { ClientesModule } from './clientes/clientes.module';
  import { PlanesMembresiaModule } from
  './planes-membresia/planes-membresia.module';
  import { MembresiasModule } from './membresias/membresias.module';
import { InventarioModule } from './inventario/inventario.module';
import { VentasModule } from './ventas/ventas.module';
import { EquipamientoModule } from './equipamiento/equipamiento.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    LogAccesoModule,
    ClientesModule,
    PlanesMembresiaModule,
    MembresiasModule,
    InventarioModule,
    VentasModule,
    EquipamientoModule,
    DashboardModule,
    ReportesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
