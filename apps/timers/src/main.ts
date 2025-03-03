import { NestFactory } from '@nestjs/core';
import { TimersModule } from './timers.module';
import { setupSwagger } from '@shield/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TimersModule);
  setupSwagger(app);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');
  const port: number = configService.get('http.port') ?? 3001;
  await app.listen(port, () =>
    logger.log(`Timers server is running on port ${port}`),
  );
}
bootstrap();
