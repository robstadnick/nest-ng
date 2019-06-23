import { enableProdMode } from '@angular/core';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
// import { path } from 'path'
// import { bodyParser } from 'body-parser'
// import { forceSsl } from 'force-ssl-heroku'
// import { fileupload } from "express-fileupload"
// import { helmet } from 'helmet'

enableProdMode();

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  // app.use(forceSsl);
  // app.use(bodyParser.json())
  // app.use(bodyParser.urlencoded({ extended: true }))
  const port = process.env.PORT || '4080'
  // app.use(fileupload());

  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
