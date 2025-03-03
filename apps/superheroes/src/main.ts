import { NestFactory } from '@nestjs/core';
import { superheroesModule } from './superheroes.module';
import { setupSwagger } from '@shield/common';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(superheroesModule);
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');
  const port: number = configService.get('http.port') ?? 3000;
  await app.listen(port, () =>
    logger.log(`superheroes server is running on port ${port}`),
  );
}
bootstrap();
