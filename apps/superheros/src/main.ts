import { NestFactory } from '@nestjs/core';
import { SuperherosModule } from './superheros.module';
import { setupSwagger } from '@shield/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SuperherosModule);
  setupSwagger(app);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');
  const port: number = configService.get('http.port') ?? 3000;
  await app.listen(port, () =>
    logger.log(`Superheros server is running on port ${port}`),
  );
}
bootstrap();
