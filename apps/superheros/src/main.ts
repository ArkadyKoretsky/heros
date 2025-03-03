import { NestFactory } from '@nestjs/core';
import { SuperherosModule } from './superheros.module';
import { setupSwagger } from '@shield/common';

async function bootstrap() {
  const app = await NestFactory.create(SuperherosModule);
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
