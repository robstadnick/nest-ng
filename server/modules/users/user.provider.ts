import { User } from '../../database/models/users/user.model';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];