import { v4 } from 'uuid';
import { makeUsersController } from '../core/UseCases/UsersController';
import { usersModelFS } from '../models/UsersFS';

export const usersController = makeUsersController(usersModelFS, v4);
