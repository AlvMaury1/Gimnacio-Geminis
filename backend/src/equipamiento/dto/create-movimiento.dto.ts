import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateMovimientoDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  equipo_id: number;

  @IsNotEmpty()
  @IsEnum(['RETIRO', 'RETORNO'])
  tipo: 'RETIRO' | 'RETORNO';

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  numero_factura?: string;

  @ValidateIf((o) => o.tipo === 'RETIRO')
  @IsNotEmpty({ message: 'fecha_estimada_retorno es obligatoria para RETIRO' })
  @IsDateString()
  fecha_estimada_retorno?: string;
}
