import { Inject, Injectable } from '@nestjs/common';
import { MessageCodeError } from '../../errors';
import { IUserService } from './interfaces/user-service.interface';
import { FindOptions } from 'sequelize/types';
import { ModelUser } from '../../database/models/users/user.model';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY') private USER_REPOSITORY: typeof ModelUser,
        @Inject('SequelizeInstance') private readonly sequelizeInstance,
    ) {

    }

    public async findAll(): Promise<Array<ModelUser>> {
        return await this.USER_REPOSITORY.findAll<ModelUser>();
    }

    // tslint:disable-next-line: ban-types
    public async findOne(options: FindOptions): Promise<ModelUser | null> {
        return await this.USER_REPOSITORY.findOne<ModelUser>(options);
    }

    public async findById(id: number): Promise<ModelUser | null> {
        return await this.USER_REPOSITORY.findByPk<ModelUser>(id);
    }

    public async create(user: ModelUser): Promise<ModelUser> {
        return await this.USER_REPOSITORY.create<ModelUser>(user, {
            
        });
        // return await this.sequelizeInstance.transaction(async transaction => {
           
        // });
    }

    public async updateSingleUser(user: ModelUser): Promise<ModelUser | null> {
        const uuser = await this.USER_REPOSITORY.update(user, {
            where: { id: user.id },
            returning: true,
        });
        const updatedUser = uuser[1][0];
        return updatedUser;
    }

}
