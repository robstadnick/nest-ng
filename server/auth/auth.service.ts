import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs';
import { jwt } from 'jsonwebtoken'
// import { ModelUser } from '../database/models/users/user.model';
import { UserService } from '../modules/users/user.service';
import { DTOPasswordResetURL, DTOSetPassword, JWTObject } from './interfaces/auth.dto';
// import { ModelUserRoles } from '../database/models/users/user.roles.model';

@Injectable()
export class AuthService {
    constructor(
        private _userService: UserService,
    ) {

    }
    /**
     * Generates jwt token for authentication
     * @param {string} id User's id stored in the database
     * @param {string} email User's email stored in the database
     * @returns {string} jwt token
     */
    // generateAuthToken(user: ModelUser) {
    //     const roles = [] as string[]
    //     if (user.user_roles) {
    //         user.user_roles.forEach(r => {
    //             roles.push(r.role);
    //         });
    //     } else {
    //         roles.push(user.role);
    //     }
    //     return jwt.sign({
    //         id: user.id,
    //         email: user.email,
    //         first_name: user.first_name,
    //         last_name: user.last_name,
    //         role: roles,
    //     }, process.env.JWT_SECRET, { expiresIn: '1 days' });
    //     // }, process.env.JWT_SECRET, { expiresIn: 10 });
    // }

    /**
     * Generates refresh jwt token for authentication
     * @param {string} id User's id stored in the database
     * @param {string} email User's email stored in the database
     * @returns {string} jwt token
     */
    async generateRefreshToken(user): Promise<string> {
        try {
            const roles = [];
            if (user.user_roles) {
                user.user_roles.forEach(r => {
                    roles.push(r.role);
                });
            } else {
                roles.push(user.role);
            }
            const token = 'access-token-' + jwt.sign({
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_employee: user.is_employee,
                role: roles,
                broker: user.broker,
                broker_code: user.broker_code,
                rid: user.quickbase_rid
            }, process.env.JWT_SECRET, { expiresIn: 60 });
            return Promise.resolve(token);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // async sendResetEmailMailGun(user: ModelUser, url: string) {
    //     const data = {
    //         from: 'CTC Transportation <noreply@ctcagent.com>',
    //         to: user.email,
    //         subject: 'Set Up Your Account',
    //         text: 'Here is a link to finish setting up your password. ' + url
    //     };
    //     // return await this._mailGunService.sendEmail(data)
    // }

    // async passwordResetToken(user: ModelUser, req): Promise<DTOPasswordResetURL> {
    //     // Generates reset password token using crypto buffer to hex
    //     const token = crypto.randomBytes(25).toString('hex');
    //     const date = new Date();
    //     date.setHours(date.getHours() + 72);
    //     let url;
    //     if (process.env.NODE_ENV === 'development') {
    //         url = `${req.hostname}:${process.env.PORT}/auth/reset-password/${token}`;
    //     } else {
    //         url = `https://${req.hostname}/auth/reset-password/${token}`;
    //     }
    //     // Set password reset url
    //     user.reset_password_expires = date;
    //     user.reset_password_token = token;
    //     // await this._userService.updateSingleUser(user);
    //     return { user, url };
    // }

    // async setPassword(body: DTOSetPassword): Promise<ModelUser> {
    //     if (body.password !== body.confirmPassword) {
    //         throw new ConflictException('Passwords do not match');
    //     }
    //     const user = await this._userService.findOne({
    //         where: {
    //             reset_password_token: body.token,
    //             reset_password_expires: {
    //                 $gt: Date.now()
    //             }
    //         }
    //     });
    //     if (!user) {
    //         throw new NotFoundException('This reset token has exipred');
    //     } else {
    //         user.password = await this.hashPassword(body.password, true);
    //         user.reset_password_token = null;
    //         user.reset_password_expires = null;
    //         return user.save();
    //     }
    // }

    async getObjectFromJWT(token: string): Promise<any> {
        const RemoveBearer = token.replace('Bearer access-token-', '');
        return jwt.verify(RemoveBearer, process.env.JWT_SECRET, function (err, jwtd: JWTObject) {
            if (err) {
                throw new UnauthorizedException()
            }
            if (jwtd) {
                return Promise.resolve(jwtd);
            }
        })
    }

    // async findByEmailAndPassword(email, password) {
    //     const user = await this._userService.findOne({ where: { email: email.toLowerCase().trim() }, include: [ModelUserRoles] });
    //     if (!user) {
    //         return Promise.reject();
    //     }
    //     if (user.archived === true) {
    //         return Promise.reject();
    //     }
    //     return bcrypt.compare(password, user.password)
    //         .then((isMatch) => {
    //             if (!isMatch) {
    //                 return Promise.reject();
    //             }
    //             return Promise.resolve(user);
    //         })
    //         .catch(() => Promise.reject());
    // }

    hashPassword(password, isUpdate = false) {
        const saltRounds = bcrypt.genSaltSync(9);
        if (isUpdate) { return bcrypt.hashSync(password, saltRounds); }
        return bcrypt.hash(password, saltRounds);
    }

}
