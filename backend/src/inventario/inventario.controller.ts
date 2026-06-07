import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLoteDto } from './dto/create-lote.dto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InventarioService } from './inventario.service';

@UseGuards(JwtAuthGuard)
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get('productos')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.inventarioService.findAllProductos(+page, +limit, search);
  }

  @Get('productos/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findProductoConLotes(id);
  }

  @Post('productos')
  create(@Body() dto: CreateProductoDto) {
    return this.inventarioService.createProducto(dto);
  }

  @Patch('productos/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    return this.inventarioService.updateProducto(id, dto);
  }

  @Patch('productos/:id/desactivar')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.desactivarProducto(id);
  }

  @Get('lotes')
  findAllLotes(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.inventarioService.findAllLotes(+page, +limit);
  }

  @Get('productos/:id/lotes')
  findLotes(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findLotesByProducto(id);
  }

  @Post('lotes')
  createLote(@Body() dto: CreateLoteDto) {
    return this.inventarioService.createLote(dto);
  }
}
