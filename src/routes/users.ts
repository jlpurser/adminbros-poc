import { Router } from 'express';
import { usersController } from '../controllers/usersController';
import { expressAdapter } from '../core/Adapters/RequestAdapter';

export const users = Router();

users.post('/', expressAdapter(usersController.addUser));

users.get('/', expressAdapter(usersController.getUsers));

users.get('/:id', expressAdapter(usersController.getUserById));

users.put('/', expressAdapter(usersController.updateUser));

users.delete('/:id', expressAdapter(usersController.deleteUser));
