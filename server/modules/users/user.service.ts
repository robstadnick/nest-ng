import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../database/models/users/user.model';
import { MessageCodeError } from '../../errors';
import { IUserService } from './interfaces/user-service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject('USER_REPOSITORY') private USER_REPOSITORY: typeof User,
        @Inject('SequelizeInstance') private readonly sequelizeInstance
    ) {

    }

    public async findAll(): Promise<Array<User>> {
        return await this.USER_REPOSITORY.findAll<User>();

    }

    public async findOne(options: Object): Promise<User | null> {
        return await this.USER_REPOSITORY.findOne<User>(options);
    }

    public async findById(id: number): Promise<User | null> {
        return await this.USER_REPOSITORY.findByPk<User>(id);
    }

    public async create(user: User): Promise<User> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.USER_REPOSITORY.create<User>(user, {
                transaction
            });
        });
    }

    public async update(user: User): Promise<User | null> {
        return await this.sequelizeInstance.transaction(async transaction => {
            let uuser = this.USER_REPOSITORY.update(user, {
                where: { id: user.id },
                returning: true,
            })
            return uuser
        });
    }

    public async delete(id: number): Promise<void> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await User.destroy({
                where: { id },
                transaction
            });
        });
    }

    /**
     * @description: Assign new value in the user found in the database.
     *
     * @param {User} user
     * @param {User} newValue
     * @return {User}
     * @private
     */
    private _assign(user: User, newValue: User): User {
        for (const key of Object.keys(user)) {
            if (user[key] !== newValue[key]) user[key] = newValue[key];
        }

        return user as User;
    }
}
