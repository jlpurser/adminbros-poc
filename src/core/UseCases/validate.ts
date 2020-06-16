import { PersistenceAdapter } from '../Adapters/Persistence';
import { User } from '../Entities';

export function validateUser(
  method: 'add' | 'update',
  persistence: PersistenceAdapter,
  user: Partial<User>
): Promise<boolean> {
  switch (method) {
    case 'add':
      // Manually checking but our dependency would cover this...
      // How reconcile business logic automatically covered by db?
      return persistence.get<User[]>('users').then(
        data =>
          !data.filter(item => item.email === user.email).length &&
          Object.keys(user).length === 3 &&
          !!user.firstName &&
          !!user.lastName &&
          !!user.email
        // Could add more logic to check formatting
        // name and email
      );

    case 'update':
      return persistence
        .get<User>('users', user.id)
        .then(
          singleUser =>
            singleUser &&
            Object.keys(singleUser).length === 4 &&
            !!singleUser.id &&
            !!singleUser.firstName &&
            !!singleUser.lastName &&
            !!singleUser.email
        ) // If no user found, catch and return false
        .catch(() => false);
    default:
      throw new Error('Invalid argument');
  }
}
