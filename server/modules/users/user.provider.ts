import { ModelUser } from "../../database/models/users/user.model";

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: ModelUser,
  },
];