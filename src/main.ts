import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(helmet());
  app.enableCors({
    origin: 'http://127.0.0.1:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(csurf({ cookie: true }));
  await app.listen(3000);
}
bootstrap();
