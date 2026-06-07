import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty()
  @IsString()
  nombre:string;
  @IsNotEmpty()
  @IsString()
  apellido:string;
  @IsEmail()
  email:string;
  @IsOptional()
  @Matches(/^\d+$/)
  telefono:string;

}
