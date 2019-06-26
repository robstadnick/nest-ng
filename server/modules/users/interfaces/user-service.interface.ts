import { User } from '../../../database/models/users/user.model';

export interface IUserService {
    findAll(): Promise<Array<User>>;
    findById(id: number): Promise<User | null>;
    findOne(options: Object): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User | null>;
    delete(id: number): Promise<void>;
}
