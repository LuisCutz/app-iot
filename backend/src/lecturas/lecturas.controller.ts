import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LecturasService } from './lecturas.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('data')
@Controller()
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) {}

  @Get('sensores')
  @ApiOperation({ summary: 'Obtener histórico de lecturas de sensores globales' })
  @ApiResponse({ status: 200, description: 'Retorna el histórico de lecturas de sensores globales' })
  async obtenerHistorico() {
    return this.lecturasService.obtenerHistorico();
  }

  @Get('info/parcelas')
  @ApiOperation({ summary: 'Obtener información completa de la última lectura de todas las parcelas' })
  @ApiResponse({ status: 200, description: 'Retorna las parcelas con su información y últimas lecturas' })
  async obtenerParcelas() {
    return this.lecturasService.obtenerParcelasConUltimaLectura();
  }

  @Get('info/parcelas/:id/historico')
  @ApiOperation({ summary: 'Obtener histórico de lecturas de una parcela específica' })
  @ApiResponse({ status: 200, description: 'Retorna el histórico de lecturas de la parcela' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la parcela' })
  async obtenerHistoricoParcela(@Param('id', ParseIntPipe) id: number) {
    return this.lecturasService.obtenerHistoricoParcela(id);
  }
}