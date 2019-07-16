import { Module, RequestMethod } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthMiddleware } from '../../auth/middleware/auth.middleware';
import { DatabaseModule } from '../../database/database.module';
import { userProviders } from './user.provider';

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        ...userProviders
    ],
    exports: [
        UserService,
    ]
})
export class UserModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: '/users', method: RequestMethod.GET },
                // { path: '/users/:id', method: RequestMethod.GET },
                // { path: '/users/:id', method: RequestMethod.PUT },
                // { path: '/users/:id', method: RequestMethod.DELETE }
            );
    }
}
