import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LecturasService {
  private readonly logger = new Logger(LecturasService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  private transformBigIntToNumber(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'bigint') {
      return Number(data);
    }

    if (data instanceof Date) {
      // Convertir a GMT-5
      const date = new Date(data);
      date.setHours(date.getHours() - 5);
      return date.toISOString();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.transformBigIntToNumber(item));
    }

    if (typeof data === 'object') {
      const transformed = {};
      for (const key in data) {
        if (key === 'latitud' || key === 'longitud') {
          transformed[key] = Number(data[key]);
        } else {
          transformed[key] = this.transformBigIntToNumber(data[key]);
        }
      }
      return transformed;
    }

    return data;
  }

  @Cron('*/5 * * * *')
  async obtenerYAlmacenarLecturas() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get('https://moriahmkt.com/iotapp/updated'),
      );

      this.logger.debug('Datos recibidos de la API:', data);

      // Si hay datos de sensores globales, almacenarlos
      if (data?.sensores) {
        const lecturaGlobal = await this.prisma.lecturaGlobal.create({
          data: {
            humedad: parseFloat(data.sensores.humedad.toString()),
            temperatura: parseFloat(data.sensores.temperatura.toString()),
            lluvia: parseFloat(data.sensores.lluvia.toString()),
            sol: parseFloat(data.sensores.sol.toString()),
          },
        });

        this.logger.log(
          `Nueva lectura global registrada - Humedad: ${data.sensores.humedad}%, Temperatura: ${data.sensores.temperatura}°C, Lluvia: ${data.sensores.lluvia}mm, Sol: ${data.sensores.sol}%`,
        );
      } else {
        this.logger.warn('No se recibieron datos de sensores globales');
      }

      // Verificar si hay datos de parcelas
      if (!data?.parcelas) {
        this.logger.warn('No se recibieron datos de parcelas');
        return { 
          message: 'Datos procesados correctamente. No se recibieron datos de parcelas.',
          sensoresGlobales: !!data?.sensores,
          parcelasRecibidas: false
        };
      }

      // Obtener todas las parcelas activas de la base de datos
      const parcelasActivas = await this.prisma.parcela.findMany({
        where: { activo: true },
      });

      // Si no hay parcelas en la respuesta, marcar todas las parcelas como inactivas
      if (data.parcelas.length === 0) {
        this.logger.warn('Lista de parcelas vacía, marcando todas las parcelas como inactivas');
        await Promise.all(
          parcelasActivas.map(parcela =>
            this.prisma.parcela.update({
              where: { id: parcela.id },
              data: { activo: false },
            }),
          ),
        );
        return { 
          message: 'Datos procesados correctamente. Todas las parcelas marcadas como inactivas.',
          sensoresGlobales: !!data?.sensores,
          parcelasRecibidas: false
        };
      }

      // Crear un conjunto con los IDs de las parcelas de la API
      const parcelasApiIds = new Set(data.parcelas.map(p => p.id));

      // Desactivar parcelas que ya no están en la API
      for (const parcela of parcelasActivas) {
        if (!parcelasApiIds.has(Number(parcela.id))) {
          await this.prisma.parcela.update({
            where: { id: parcela.id },
            data: { activo: false },
          });
          this.logger.log(`Parcela ${parcela.id} marcada como inactiva`);
        }
      }

      // Procesar y almacenar lecturas de parcelas
      for (const parcela of data.parcelas) {
        try {
          // Validar que la parcela tenga todos los datos necesarios
          if (!parcela.sensor || !parcela.nombre || !parcela.ubicacion) {
            this.logger.warn(`Parcela ${parcela.id} no tiene todos los datos necesarios, omitiendo...`);
            continue;
          }

          // Actualizar o crear parcela
          const parcelaActualizada = await this.prisma.parcela.upsert({
            where: { id: parcela.id },
            create: {
              id: parcela.id,
              nombre: parcela.nombre,
              ubicacion: parcela.ubicacion,
              responsable: parcela.responsable,
              tipo_cultivo: parcela.tipo_cultivo,
              latitud: parseFloat(parcela.latitud.toString()),
              longitud: parseFloat(parcela.longitud.toString()),
              activo: true,
            },
            update: {
              nombre: parcela.nombre,
              ubicacion: parcela.ubicacion,
              responsable: parcela.responsable,
              tipo_cultivo: parcela.tipo_cultivo,
              latitud: parseFloat(parcela.latitud.toString()),
              longitud: parseFloat(parcela.longitud.toString()),
              activo: true,
            },
          });

          // Crear lectura para la parcela
          const lecturaParcela = await this.prisma.lectura.create({
            data: {
              parcela_id: parcelaActualizada.id,
              humedad: parseFloat(parcela.sensor.humedad.toString()),
              temperatura: parseFloat(parcela.sensor.temperatura.toString()),
              lluvia: parseFloat(parcela.sensor.lluvia.toString()),
              sol: parseFloat(parcela.sensor.sol.toString()),
              ultimo_riego: parcela.ultimo_riego ? new Date(parcela.ultimo_riego) : null,
            },
          });

          this.logger.log(
            `Nueva lectura para parcela "${parcela.nombre}" - Humedad: ${parcela.sensor.humedad}%, Temperatura: ${parcela.sensor.temperatura}°C, Lluvia: ${parcela.sensor.lluvia}mm, Sol: ${parcela.sensor.sol}%`,
          );
        } catch (error) {
          this.logger.error(`Error procesando parcela ${parcela.id}:`, error);
          // Continuar con la siguiente parcela
          continue;
        }
      }

      return { 
        message: 'Datos procesados correctamente',
        sensoresGlobales: !!data?.sensores,
        parcelasRecibidas: true
      };
    } catch (error) {
      this.logger.error('Error al obtener o almacenar lecturas:', error);
      if (error.response) {
        this.logger.error('Respuesta de la API:', error.response.data);
      }
      throw error;
    }
  }

  async obtenerHistorico() {
    const historico = await this.prisma.lecturaGlobal.findMany({
      orderBy: {
        fecha_lectura: 'desc',
      },
    });
    return this.transformBigIntToNumber(historico);
  }

  async obtenerParcelasConUltimaLectura() {
    const parcelas = await this.prisma.parcela.findMany({
      include: {
        lecturas: {
          orderBy: {
            fecha_lectura: 'desc',
          },
          take: 1,
        },
      },
      orderBy: [
        { activo: 'desc' }, // Primero las activas (true viene antes que false)
        { id: 'asc' }, // Luego ordenar por ID de forma ascendente
      ],
    });
    return this.transformBigIntToNumber(parcelas);
  }

  async obtenerHistoricoParcela(id: number) {
    // Verificar si la parcela existe
    const parcela = await this.prisma.parcela.findUnique({
      where: { id },
      include: {
        lecturas: {
          orderBy: {
            fecha_lectura: 'desc',
          },
        },
      },
    });

    if (!parcela) {
      throw new NotFoundException(`No se encontró la parcela con ID ${id}`);
    }

    return this.transformBigIntToNumber(parcela);
  }
}