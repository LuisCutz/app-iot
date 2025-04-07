import { Module } from '@nestjs/common';
import { LecturasService } from './lecturas.service';
import { LecturasController } from './lecturas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, HttpModule, ConfigModule],
  controllers: [LecturasController],
  providers: [LecturasService],
})
export class LecturasModule {}