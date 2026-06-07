import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EquipamientoModule } from './equipamiento/equipamiento.module';
import { HealthController } from './health.controller';
import { InventarioModule } from './inventario/inventario.module';
import { LogAccesoModule } from './log-acceso/log-acceso.module';
import { MembresiasModule } from './membresias/membresias.module';
import { PlanesMembresiaModule } from './planes-membresia/planes-membresia.module';
import { ReportesModule } from './reportes/reportes.module';
import { SeedService } from './seed.service';
import { Usuario } from './usuarios/usuario.entity';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
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
    TypeOrmModule.forFeature([Usuario]),
  ],
  controllers: [HealthController],
  providers: [SeedService],
})
export class AppModule {}
