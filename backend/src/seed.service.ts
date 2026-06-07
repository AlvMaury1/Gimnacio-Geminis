import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from './usuarios/usuario.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) {}

  async onApplicationBootstrap() {
    const exists = await this.userRepository.findOne({ where: { rol: 'ADMIN' } });
    if (exists) return;

    const hash = await bcrypt.hash('Admin123!', 12);
    const admin = this.userRepository.create({
      email: 'admin@gimnacio.com',
      password: hash,
      rol: 'ADMIN',
    });
    await this.userRepository.save(admin);
    console.log('Admin creado: admin@gimnacio.com / Admin123!');
  }
}
