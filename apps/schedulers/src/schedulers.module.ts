import { Module } from '@nestjs/common';
import { SchedulersController } from './schedulers.controller';
import { SchedulersService } from './schedulers.service';
import { ServiceInfoModule } from '@shield/common';
import { RedisConnectionOptions, schedulersServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { HttpModule } from '@nestjs/axios';
import { SchedulersProcessor } from './schedulers.processor';

@Module({
  imports: [
    ServiceInfoModule.register(schedulersServiceInfo),
    YamlConfigModule,
    HttpModule,
    BullModule.registerQueueAsync({
      name: 'timer',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: configService.get<RedisConnectionOptions>('redis') ?? {},
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [SchedulersController],
  providers: [SchedulersService, SchedulersProcessor],
})
export class SchedulersModule {}
