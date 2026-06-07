import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateLoteDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  producto_id: number;

  @IsOptional()
  @IsString()
  numero_lote?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad_inicial: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_costo: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_compra: string;

  @IsOptional()
  @IsDateString()
  fecha_vencimiento?: string;
}
