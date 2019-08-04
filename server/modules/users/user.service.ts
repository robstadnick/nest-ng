import { Inject, Injectable } from '@nestjs/common';
import { MessageCodeError } from '../../errors';
// import { IUserService } from './interfaces/user-service.interface';
import { ModelUser } from './interfaces/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('USER_MODEL') private readonly userModel: Model<ModelUser>,
    ) {
    }

    public async findAll(): Promise<Array<ModelUser>> {
        return await this.userModel.find();
    }

    public async findOne(options: any): Promise<ModelUser | null> {
        return await this.userModel.findOne(options);
    }

    public async findById(id: number): Promise<ModelUser | null> {
        return await this.userModel.findById(id);
    }

    public async create(user: ModelUser): Promise<ModelUser> {
        const newUser = new this.userModel(user);
        return await newUser.save();
    }

    public async updateSingleUser(user: ModelUser): Promise<ModelUser | null> {
        const uuser = await this.userModel.update(user, {
            where: { id: user.id },
            returning: true,
        });
        const updatedUser = uuser[1][0];
        return updatedUser;
    }

}
