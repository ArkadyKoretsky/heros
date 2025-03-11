import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { RedisConnectionOptions } from '../utils';
import { ConfigService } from '@nestjs/config';
import { RedisOptions, Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  private readonly redisConnectionOptions: RedisConnectionOptions;

  constructor(
    private health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
  ) {
    this.redisConnectionOptions = this.configService.get('redis') ?? {};
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.microservice.pingCheck<RedisOptions>('Redis', {
          transport: Transport.REDIS,
          options: this.redisConnectionOptions,
        }),
    ]);
  }
}
