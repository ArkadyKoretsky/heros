import { Module } from '@nestjs/common';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';
import { ServiceInfoModule } from '@shield/common';
import { timersServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Timer, TimerSchema } from './entities';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ServiceInfoModule.register(timersServiceInfo),
    YamlConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Timer.name, schema: TimerSchema }]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get('timeout'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [TimersController],
  providers: [TimersService],
})
export class TimersModule {}
