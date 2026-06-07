import { IsInt, IsDateString, IsPositive } from 'class-validator';

export class CreateMembresiaDto {
  @IsInt()
  @IsPositive()
  cliente_id: number;

  @IsInt()
  @IsPositive()
  plan_membresia_id: number;

  @IsDateString()
  fecha_inicio: string;
}
