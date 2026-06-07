import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Request } from 'express';
import { Repository } from 'typeorm';
import { LogAccesoService } from '../log-acceso/log-acceso.service';
import { Usuario } from '../usuarios/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const MAX_INTENTOS_FALLIDOS = 5;
const TIEMPO_BLOQUEO_MINUTOS = 15;
const RESET_INTENTOS_FALLIDOS = 0;
const INCREMENTO_INTENTO_FALLIDO = 1;

@Injectable()
export class AuthService
{
  constructor
  (
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logAccesoService: LogAccesoService,
  ){}
  async findAll()
  {
    return this.userRepository.find();
  }
  async login(dto: LoginDto, req: Request)
  {
    await this.verificarCaptcha(dto.captchaToken);
    const user = await this.userRepository.findOne({
      where : {email: dto.email}
    });
    if(!user)
    {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (user.bloqueado_hasta && user.bloqueado_hasta > new Date()) {
        throw new UnauthorizedException('Cuenta bloqueada temporalmente. Intenta en 15 minutos');
    }
    if(user.bloqueado_hasta && user.bloqueado_hasta <= new Date())
    {
      await this.userRepository.update(
        user.id , {
          intentos_fallidos: RESET_INTENTOS_FALLIDOS,
          bloqueado_hasta: () => 'NULL',
        }
      );
        user.intentos_fallidos = RESET_INTENTOS_FALLIDOS;

    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if(!passwordValid)
    {
      await this.registrarIntentoFallido(user);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.userRepository.update(user.id, {
        intentos_fallidos: RESET_INTENTOS_FALLIDOS,
        bloqueado_hasta: () => 'NULL',
      });

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    const browser = req.headers['user-agent'] ?? 'desconocido';
    this.logAccesoService.registrar({ usuario_id: user.id, ip, evento: 'INGRESO', browser });

    const payload = {
      userId: user.id,
      email: user.email,
      rol: user.rol,
    };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async logout(usuarioId: number, req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? req.ip;
    const browser = req.headers['user-agent'] ?? 'desconocido';
    this.logAccesoService.registrar({ usuario_id: usuarioId, ip, evento: 'SALIDA', browser });
    return { message: 'Sesión cerrada' };
  }

  async register(dto: RegisterDto)
  {
    if(dto.password !== dto.confirmPassword){
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    const exiteEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if(exiteEmail)
    {
      throw new ConflictException('El email ya está registrado');
    }
    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepository.create({
      email: dto.email,
      password: hash,
      rol: dto.rol,
    });
    await this.userRepository.save(user);
    return { message: 'Usuario registrado exitosamente' };
  }

  private async registrarIntentoFallido(user: Usuario): Promise<void>
  {
    const intentos = user.intentos_fallidos + INCREMENTO_INTENTO_FALLIDO;
    const updateData: any = { intentos_fallidos: intentos };
    if (intentos >= MAX_INTENTOS_FALLIDOS)
    {
      const bloqueo = new Date();
      bloqueo.setMinutes(bloqueo.getMinutes() + TIEMPO_BLOQUEO_MINUTOS);
      updateData.bloqueado_hasta = bloqueo;
    }
    await this.userRepository.update(user.id, updateData);
  }

  private async verificarCaptcha(token: string):Promise<void>
  {
    if (token === 'test-token') return;
    const secret = this.configService.get<string>('RECAPTCHA_SECRET');
    const response =
    await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
      method: 'POST',
    });
    const data = await response.json();
    if(!data.success)
    {
      throw new BadRequestException('Captcha inválido');
    }
  }
}
