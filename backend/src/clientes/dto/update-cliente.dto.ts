import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

// TODO: extender PartialType(CreateClienteDto) — hace todos los campos opcionales automáticamente
export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
