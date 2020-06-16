import { Entity } from '../Entities';

/**
 * Connection between db dependency and main use case controller
 * Can be implement with a class:
 * ```typescript
 * class DBAdapter implements Persistence
 * ```
 * or with a factory function with a read only return type
 * ```typescript
 * Readonly<PersistenceAdapter>
 * ```
 */
export type PersistenceAdapter = {
  /**
   * @param document Name of table or document in persistence method
   * @param object New item to be added to document
   */
  add: <T extends Required<Entity>>(document: string, object: T) => Promise<T>;
  /**
   * @param document Name of table or document in persistence method
   * @param take Number of items to retrieve
   * @param offset Starting index for `take`
   */
  get: <T extends Required<Entity> | Required<Entity>[]>(
    document: string,
    id?: string,
    take?: number,
    offset?: number
  ) => Promise<T>;
  /**
   * @param document Name of table or document in persistence method
   * @param object Existing item to be updated in document
   */
  update: <T extends Required<Entity>>(
    document: string,
    object: T
  ) => Promise<T>;
  /**
   * @param document Name of table or document in persistence method
   * @param id Id of item to be delted in document
   */
  delete: <T extends Required<Entity>>(
    document: string,
    id: string
  ) => Promise<{ deleted: T }>;
};
