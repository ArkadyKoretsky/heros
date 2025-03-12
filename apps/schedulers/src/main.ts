import { NestFactory } from '@nestjs/core';
import { SchedulersModule } from './schedulers.module';
import { setupSwagger } from '@shield/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(SchedulersModule, { cors: true });
  setupSwagger(app);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');
  const port: number = configService.get('http.port') ?? 3002;
  await app.listen(port, () =>
    logger.log(`Schedulers server is running on port ${port}`),
  );
}
bootstrap();
