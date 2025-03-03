import { NestFactory } from '@nestjs/core';
import { SchedulersModule } from './schedulers.module';
import { setupSwagger } from '@shield/common';

async function bootstrap() {
  const app = await NestFactory.create(SchedulersModule);
  setupSwagger(app);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
