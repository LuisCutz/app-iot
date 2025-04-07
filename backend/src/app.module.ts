import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigurationModule } from './config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LecturasModule } from './lecturas/lecturas.module';

@Module({
  imports: [
    ConfigurationModule,
    AuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    LecturasModule,
  ],
})
export class AppModule {}