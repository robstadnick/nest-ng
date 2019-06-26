import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    BeforeValidate,
    BeforeCreate,
    HasMany
} from 'sequelize-typescript';
import { MessageCodeError } from '../../../errors';

import * as bcrypt from 'bcryptjs';
import { UserRoles } from './user.roles.model';

@Table({
    tableName: 'users',
})
export class User extends Model<User> {

    @Column({
        type: DataType.BIGINT,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    public id: number;

    @CreatedAt public createdAt: Date;

    @UpdatedAt public updatedAt: Date;

    @Column({
        type: DataType.CHAR,
        allowNull: false
    })
    public first_name: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false
    })
    public last_name: string;

    @Column({
        type: DataType.CHAR,
    })
    public role: string;

    @Column({
        type: DataType.CHAR(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            isUnique: async (value: string, next: Function): Promise<any> => {
                const isExist = await User.findOne({ where: { email: value } });
                if (isExist) {
                    const error = new MessageCodeError('user:create:emailAlreadyExist');
                    next(error);
                }
                next();
            }
        }
    })
    public email: string;

    @Column({
        type: DataType.CHAR,
    })
    public password: string

    @Column({
        type: DataType.CHAR,
    })
    public phone: string

    @Column({
        type: DataType.CHAR,
    })
    public status: string

    @Column({
        type: DataType.CHAR,
    })
    public billing_street_address_1: string

    @Column({
        type: DataType.CHAR,
    })
    public billing_street_address_2: string

    @Column({
        type: DataType.CHAR,
    })
    public billing_city: string

    @Column({
        type: DataType.CHAR,
    })
    public billing_state: string

    @Column({
        type: DataType.CHAR,
    })
    public billing_zip: string

    @Column({
        type: DataType.CHAR,
    })
    public reset_password_token: string

    @Column({
        type: DataType.CHAR,
    })
    public reset_password_expires: Date

    @Column({
        type: DataType.BOOLEAN,
    })
    public archived: boolean

    @HasMany(() => UserRoles)
    user_roles: UserRoles[]

    @BeforeValidate
    public static validateData(user: User, options: any) {
        // if (!options.transaction) { throw new Error('Missing transaction.'); }
        if (!user.first_name) { throw new MessageCodeError('user:create:missingFirstName'); }
        if (!user.last_name) { throw new MessageCodeError('user:create:missingLastName'); }
        if (!user.email) { throw new MessageCodeError('user:create:missingEmail'); }
        if (!user.password) { throw new MessageCodeError('user:create:missingPassword'); }
    }

    @BeforeCreate
    public static async hashPassword(user: User) {
        // if (!options.transaction) { throw new Error('Missing transaction.'); 
        const saltRounds = bcrypt.genSaltSync(13);
        const isUpdate = false;
        const password = await bcrypt.hash(user.password, saltRounds)
        user.password = password
        // if (isUpdate) { user.password = bcrypt.hashSync(user.password, saltRounds); }
    }
}
