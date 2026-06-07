import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export enum Rol {
  ADMIN = 'ADMIN',
  RECEPCIONISTA = 'RECEPCIONISTA'
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, {
    message: 'Contraseña débil: mínimo 8 caracteres, una mayúscula, un número y un símbolo',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsEnum(Rol)
  rol: Rol;
}
