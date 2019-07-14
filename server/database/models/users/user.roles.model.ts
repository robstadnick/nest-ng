import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    DeletedAt,
    BeforeValidate,
    BeforeCreate,
    BelongsTo
} from 'sequelize-typescript';
import { MessageCodeError } from '../../../errors';
import { ModelUser } from './user.model';


@Table({
    tableName: "user_roles",
})
export class ModelUserRoles extends Model<ModelUserRoles> {

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

    @ForeignKey(() => ModelUser)
    @Column({
        type: DataType.CHAR,
        allowNull: false
    })
    public user_id: string;

    @Column({
        type: DataType.CHAR,
        allowNull: false,
    })
    public role: string;

    @BelongsTo(() => ModelUser)
    users: ModelUser;
    // @BeforeValidate
    // public static validateData(user: User, options: any) {
    //     if (!options.transaction) { throw new Error('Missing transaction.'); }
    //     if (!user.first_name) { throw new MessageCodeError('user:create:missingFirstName'); }
    //     if (!user.last_name) { throw new MessageCodeError('user:create:missingLastName'); }
    //     if (!user.email) { throw new MessageCodeError('user:create:missingEmail'); }
    //     if (!user.password) { throw new MessageCodeError('user:create:missingPassword'); }
    // }

    // @BeforeCreate
    // public static async hashPassword(user: User) {
        
    // }
}
