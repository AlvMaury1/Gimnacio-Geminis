import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanMembresiaDto } from './create-plan-membresia.dto';

export class UpdatePlanMembresiaDto extends PartialType(CreatePlanMembresiaDto) {}
