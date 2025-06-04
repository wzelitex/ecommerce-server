import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://www.ecommerce-business.com.mx',
      'https://www.ecommerce-go.com.mx',
      'https://www.ecommerce-delivery.com.mx',
      'https://dash-core-nu.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(4000);

  console.log('Connected to http:localhost:4000');
}
bootstrap();
