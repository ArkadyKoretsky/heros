import { NestFactory } from '@nestjs/core';
import { TimersModule } from './timers.module';
import { setupSwagger } from '@shield/common';

async function bootstrap() {
  const app = await NestFactory.create(TimersModule);
  setupSwagger(app);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
