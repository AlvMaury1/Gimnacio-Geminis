import { IsString, IsNotEmpty, IsInt, IsPositive, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePlanMembresiaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  @IsPositive()
  duracion_dias: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
