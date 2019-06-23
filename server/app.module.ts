import { Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
// import { AuthModule } from './auth/auth.module';
// import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      viewsPath: join(process.cwd(), 'dist/browser'),
      bundle: require('../server/main'),
      liveReload: true
    }),
    // AuthModule,
    // DatabaseModule
  ],
  providers: []
})
export class ApplicationModule {}
