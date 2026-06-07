import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VentaItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  producto_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;
}

export class CreateVentaDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cliente_id: number;

  @IsNotEmpty()
  @IsEnum(['EFECTIVO', 'QR', 'TARJETA'])
  tipo_pago: 'EFECTIVO' | 'QR' | 'TARJETA';

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VentaItemDto)
  items: VentaItemDto[];
}
