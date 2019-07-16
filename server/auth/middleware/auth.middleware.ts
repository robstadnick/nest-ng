import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MessageCodeError } from '../../errors';
// import { ModelUser } from '../../database/models/users/user.model'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    public async use(req, res, next) {
        if (req.headers.authorization && (req.headers.authorization as string)) {
            const token = (req.headers.authorization as string).replace('Bearer access-token-', '')
            const decoded: any = jwt.verify(token, process.env.JWT_KEY || '');
            // const user = await ModelUser.findOne<ModelUser>({
            //     where: {
            //         id: decoded.id,
            //         email: decoded.email
            //     }
            // });
            // if (!user) throw new MessageCodeError('request:unauthorized');
            next();
        } else {
            throw new MessageCodeError('request:unauthorized');
        }
    }
}