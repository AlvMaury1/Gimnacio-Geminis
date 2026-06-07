import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateEquipoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  variante?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad_total: number;

  @IsOptional()
  @IsString()
  numero_serie?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsDateString()
  fecha_adquisicion?: string;

  @IsOptional()
  @IsDateString()
  proximo_mantenimiento?: string;
}
