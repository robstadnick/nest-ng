import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/users/user.module';
// import { MongoDatabaseModule } from './mongo/mongo-database.module';

const domino = require('domino');
const win = domino.createWindow();

global['window'] = win;
global['document'] = win.document;
global['navigator'] = win.navigator;
global['CSS'] = undefined;
global['Event'] = undefined;
global['localStorage'] = undefined;
global['getItem'] = undefined;

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      viewsPath: join(process.cwd(), 'dist/browser'),
      bundle: require('../server/main'),
      liveReload: true
    }),

    MongooseModule.forRoot(process.env.MONGO_URI, { useNewUrlParser: true }),
    // MongoDatabaseModule,
    // AuthModule,
    UserModule
  ],
  providers: []
})
export class ApplicationModule { }
