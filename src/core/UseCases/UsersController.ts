import { PersistenceAdapter } from '../Adapters/Persistence';
import { APIResponse, User } from '../Entities';
import { validateUser } from './validate';

/**
 * Controller to be injected with data persistence adapter.
 *
 * Can be implemented with a class:
 * ```typescript
 * class NameOfController implements UsersController
 * ```
 * or with a factory function where the return type is:
 * ```typescript
 * Readonly<UsersController>
 * ```
 */
type UsersController = {
  /** fn signature could be `(user: Omit<User, 'id')` if the persistence module creates ids */
  addUser: (user: Omit<User, 'id'>) => Promise<APIResponse<User>>;
  /** Retrieves single user */
  getUserById: (id: string) => Promise<APIResponse<User>>;
  /**
   * Retrieves all Users for a subset from  @param take,
   * starting at @param offset counting from 0
   *
   * Without argument it returns entire collection
   */
  getUsers: (take?: number, offset?: number) => Promise<APIResponse<User[]>>;
  /** Updates single User record */
  updateUser: (user: User) => Promise<APIResponse<User>>;
  /** Either deletes or marks for deletion */
  deleteUser: (id: string) => Promise<APIResponse<{ deleted: User }>>;
};

/**
 * Controller creator with dependency injection
 * @param persistence An adapter specific to our chosen persistence dependency
 *
 * @returns UsersController, controls flow of data
 */
export function makeUsersController(
  persistence: PersistenceAdapter,
  createId: () => string
): Readonly<UsersController> {
  // Other business rules could be defined here or other modules
  // and called by the methods in the returned frozen object
  // for example a `validate` function could be called on `user`
  // in the `addUser` method
  return Object.freeze({
    // CREATE
    addUser: user =>
      validateUser('add', persistence, user).then(valid =>
        valid
          ? persistence
              .add<User>('users', { id: createId(), ...user })
              .then(response => ({
                // TS types as boolean without assertion
                success: true as true,
                data: response as User,
              }))
              .catch(error => ({
                success: false,
                error,
              }))
          : {
              success: false,
              error: 'Invalid user',
            }
      ),
    // READ 1
    getUserById: id =>
      persistence
        .get<User>('users', id)
        .then(response => ({
          success: true as true,
          data: response as User,
        }))
        .catch(error => ({
          success: false,
          error,
        })),
    // READ <limit>
    getUsers: (take?, offset?) =>
      persistence
        .get<User[]>('users', undefined, take, offset)
        .then(response => ({
          success: true as true,
          data: response as User[],
        }))
        .catch(error => ({
          success: false,
          error,
        })),
    // UPDATE
    updateUser: user =>
      validateUser('update', persistence, user).then(valid =>
        valid
          ? persistence
              .update<User>('users', user)
              .then(response => ({
                success: true as true,
                data: response as User,
              }))
              .catch(error => ({
                success: false,
                error,
              }))
          : {
              success: false,
              error: 'Invalid user',
            }
      ),
    // DELETE
    deleteUser: id =>
      persistence
        .delete<User>('users', id)
        .then(response => ({
          success: true as true,
          data: {
            deleted: (response as unknown) as User,
          },
        }))
        .catch(error => ({
          success: false,
          error,
        })),
  });
}
