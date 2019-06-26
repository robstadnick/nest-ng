import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto'
// import * as bcrypt from 'bcryptjs'
import { jwt } from 'jsonwebtoken'
import { User } from '../database/models/users/user.model';
// import { db } from '../../../database/database'


@Injectable()
export class AuthService {
    private generateIntercomHash(email) {
        const intercomHashSecret = 'b4r357DOOBeqYY3QJ_DFW64XG0D2-ImjhkZWkvcw'
        const hash = crypto.createHmac('SHA256', intercomHashSecret).update(email).digest('hex');
        return hash;
    }

    /**
     * Generates jwt token for authentication
     * @param {string} id User's id stored in the database
     * @param {string} email User's email stored in the database
     * @returns {string} jwt token
     */
    generateAuthToken(user: User) {
        const roles = [] as string[]
        if (user.user_roles) {
            user.user_roles.forEach(r => {
                roles.push(r.role);
            });
        } else {
            roles.push(user.role);
        }
        return jwt.sign({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_employee: user.is_employee,
            role: roles,
            broker: user.broker,
            broker_code: user.broker_code,
            rid: user.quickbase_rid,
        }, process.env.JWT_SECRET, { expiresIn: '1 days' });
        // }, process.env.JWT_SECRET, { expiresIn: 10 });
    }

    /**
     * Generates refresh jwt token for authentication
     * @param {string} id User's id stored in the database
     * @param {string} email User's email stored in the database
     * @returns {string} jwt token
     */
    generateRefreshToken(user) {
        const roles = [];
        if (user.user_roles) {
            user.user_roles.forEach(r => {
                roles.push(r.role);
            });
        } else {
            roles.push(user.role);
        }
        return jwt.sign({
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
    }

    // validate(token) {
    //     const RemoveBearer = token.replace('Bearer access-token-', ''); // TODO: I think I'll need to add the code below
    //     // if(!RemoveBearer){
    //     //   return Promise.reject('Not Authorized')
    //     // }
    //     return jwt.verify(RemoveBearer, process.env.JWT_SECRET, function (err, jwtd) {
    //         if (err) {
    //             return Promise.reject('Not Authorized');
    //         }
    //         if (jwtd) {
    //             return Promise.resolve(jwtd.broker_code);
    //         }
    //     });
    // }

    // /**
    //  * This function is heavily used to grab data from request without additional queries to db + authentication
    //  * @param {string} auth Authentication token from header
    //  * @returns  user.id, user.email, user.first_name, user.last_name, user.is_employee, roles, user.broker,user.broker_code, user.quickbase_rid
    //  */
    // getObjectFromJWT(auth) {
    //     const RemoveBearer = auth.replace('Bearer access-token-', '');
    //     return jwt.verify(RemoveBearer, process.env.JWT_SECRET, function (err, jwtd) {
    //         if (err) {
    //             return Promise.reject('Not Authorized');
    //         }
    //         if (jwtd) {
    //             // console.time("dbsave");
    //             // return checkDisabledUsers(jwtd.id)
    //             //   .then((disabled) => {
    //             //     if (disabled) {
    //             //       return Promise.reject('Not Authorized')
    //             //     } else {
    //             //       // console.timeEnd("dbsave");
    //             //       return Promise.resolve(jwtd)
    //             //     }
    //             //   }).catch((err) => {
    //             //     console.log('ErrorDescription', err)
    //             //     return Promise.reject(err)
    //             //   })
    //             return Promise.resolve(jwtd);
    //         }
    //     });
    // }

    // getBrokerCodeFromJWT(auth) {
    //     const RemoveBearer = auth.replace('Bearer access-token-', '');
    //     return jwt.verify(RemoveBearer, process.env.JWT_SECRET, function (err, jwtd) {
    //         if (err) {
    //             return Promise.reject('Not Authorized');
    //         }
    //         if (jwtd) {
    //             // return checkDisabledUsers(jwtd.id)
    //             //   .then((disabled) => {
    //             //     if (disabled) {
    //             //       return Promise.reject('Not Authorized')
    //             //     } else {
    //             //       return Promise.resolve(jwtd.broker_code)
    //             //     }
    //             //   }).catch((err) => {
    //             //     console.log('ErrorDescription', err)
    //             //     return Promise.reject(err)
    //             //   })
    //             return Promise.resolve(jwtd.broker_code);
    //         }
    //     });
    // }

    // getEmployeeRolesFromJWT(auth) {
    //     const RemoveBearer = auth.replace('Bearer access-token-', '');
    //     return jwt.verify(RemoveBearer, process.env.JWT_SECRET, function (err, jwtd) {
    //         if (err) {
    //             return Promise.reject('Not Authorized');
    //         }
    //         if (jwtd) {
    //             return db.User.findOne({
    //                 where: {
    //                     id: jwtd.id,
    //                     is_employee: true,
    //                     employee_is_active: true
    //                 }, include: [db.UserRoles]
    //             })
    //                 .then((user) => {
    //                     return Promise.resolve(user.user_roles);
    //                 }).catch((err) => {
    //                     console.log('ErrorDescription', err);
    //                     return Promise.reject(err);
    //                 });
    //         }
    //     });
    // }

    // checkForEmployeeJWT(auth) {
    //     const RemoveBearer = auth.replace('Bearer access-token-', '');
    //     const jwtd = jwt.decode(RemoveBearer);
    //     if (jwtd) {
    //         return Promise.resolve(jwtd.broker_code);
    //     } else {
    //         return Promise.reject('Not Authorized');
    //     }
    // }

    // /**
    //  * Finds a user by supplied credentials
    //  * @param {string} email The user's email
    //  * @param {string} password The user's password
    //  * @returns {Object} user
    //  */
    // findByEmailAndPassword(email, password) {
    //     return db.User.findOne({
    //         where: {
    //             email: email.toLowerCase().trim()
    //         }, include: [{ model: db.UserRoles }]
    //     })
    //         .then((user) => {
    //             if (!user) {
    //                 return Promise.reject();
    //             }
    //             if (user.is_employee == true) {
    //                 if (user.employee_is_active == false) {
    //                     return Promise.reject();
    //                 }
    //             }
    //             if (user.archived == true) {
    //                 return Promise.reject();
    //             }
    //             return bcrypt.compare(password, user.password)
    //                 .then((isMatch) => {
    //                     if (!isMatch) {
    //                         return Promise.reject();
    //                     }
    //                     return Promise.resolve(user);
    //                 })
    //                 .catch(() => Promise.reject());
    //         });
    // }

    // checkDisabledUsers(user_id) {
    //     // TODO: finish building this out to force a logout.
    //     // We will need to make sure every request returns the error instead of "Not Authorized"
    //     // Return an object with {msg: 'Not Authorized', logout: true}
    //     // console.log(user_id)
    //     const fs = require('fs');
    //     const inspect = new Promise((resolve, reject) => {
    //         return fs.readFile('server/authentication/helpers/blacklist.txt', 'utf-8', function (err, data) {
    //             if (err) {
    //                 return reject(err);
    //             }
    //             if (data.indexOf(user_id) >= 0) {
    //                 console.log('Checked, True');
    //                 return resolve(true);
    //             }
    //             // console.log('Checked, False')
    //             return resolve(false);
    //         });
    //     });
    //     return inspect;
    // }

    /**
 * Hashes supplied password
 * @param {string} password The user's password to be hashed
 * @param {boolean} isUpdate Set to true when updating a user
 * @returns {String | Promise} hashed password
 */
    // hashPassword(password, isUpdate = false) {
    //     const saltRounds = bcrypt.genSaltSync(9);
    //     if (isUpdate) { return bcrypt.hashSync(password, saltRounds); }
    //     return bcrypt.hash(password, saltRounds);
    // }

    generateUserObject({
        id,
        first_name,
        last_name,
        email,
        phone,
        status,
        broker_code,
        bio,
        appointment_date,
        avatar_url,
        broker,
        billing_street_address_1,
        billing_street_address_2,
        billing_city,
        billing_state,
        billing_zip,
        createdAt,
        updatedAt,
        quickbase_rid,
        is_employee,
        employee_is_active,
    }) {
        return {
            id,
            first_name,
            last_name,
            email,
            phone,
            status,
            roles: ['USER'],
            broker_code,
            bio,
            appointment_date,
            avatar_url,
            broker,
            billing_street_address_1,
            billing_street_address_2,
            billing_city,
            billing_state,
            billing_zip,
            quickbase_rid,
            is_employee,
            employee_is_active,
            createdAt,
            updatedAt,
        };
    }
}
