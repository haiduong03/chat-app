import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.HOST_PORT);
}
bootstrap();
