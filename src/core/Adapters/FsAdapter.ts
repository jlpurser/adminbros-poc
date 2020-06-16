import fs from 'fs';
import { Entity } from '../Entities';
import { PersistenceAdapter } from './Persistence';

type FS = typeof fs;

/**
 * This is an example of a `PersistenceAdapter` implementation,
 * a `PersistenceAdapter` could be implemented with any injection of
 * a persistence dependency, such as a DB connection
 * e.g.
 * ```typescript
 * require('pg').Pool(dbConnection)
 * ```
 * or an ORM, such as Sequelize or Mongoose
 * @param lib An implementation of fileSystem
 * @param path The path to our text file
 * @returns A model the persists using the file system and `.txt` file
 */
export function makeFsAdapter(
  // For other adapters, such as DBs like mongo or postgres,
  // the parameter would be the DB connection
  lib: FS,
  path: string
): Readonly<PersistenceAdapter> {
  return Object.freeze({
    // CREATE
    add: (document, object) =>
      new Promise((res, rej) => {
        lib.readFile(path, { encoding: 'utf-8' }, (err, data) => {
          if (err) {
            rej(err);
          }

          const json = JSON.parse(data);

          lib.writeFile(
            path,
            JSON.stringify(
              {
                ...json,
                [document]: [...json[document], object],
              },
              null,
              2
            ),
            writeErr => {
              if (writeErr) {
                rej(writeErr);
              }
            }
          );
          // @ts-ignore
          res(object);
        });
      }),

    // READ
    get: (document, id, take, offset) =>
      new Promise((res, rej) => {
        lib.readFile(path, { encoding: 'utf-8' }, (err, data) => {
          if (err) {
            rej(err);
          }
          const json = JSON.parse(data);

          if (id !== undefined) {
            const singleItem = json[document].find(
              (item: Required<Entity>) => item.id === id
            );

            singleItem ? res(singleItem) : rej('Invalid id');
          } else if (take !== undefined && offset === undefined) {
            res(json[document].slice(0, take));
          } else if (take !== undefined && offset !== undefined) {
            res(json[document].slice(offset, offset + take));
          } else {
            res(json[document]);
          }
        });
      }),

    // UPDATE
    update: (document, object) =>
      new Promise((res, rej) => {
        lib.readFile(path, { encoding: 'utf-8' }, (err, data) => {
          if (err) {
            rej(err);
          }
          const json = JSON.parse(data);

          const indexToUpdate = json[document].findIndex(
            (item: Required<Entity>) => item.id === object.id
          );

          if (indexToUpdate > -1) {
            json[document][indexToUpdate] = object;
          } else {
            rej('Invalid id');
          }

          lib.writeFile(path, JSON.stringify(json, null, 2), writeErr => {
            if (writeErr) {
              rej(writeErr);
            }
            // @ts-ignore
            res(object);
          });
        });
      }),

    // DELETE
    delete: (document, id) =>
      new Promise((res, rej) => {
        lib.readFile(path, (err, data) => {
          if (err) {
            rej(err);
          }

          const json = JSON.parse(data.toString());

          const indexToDelete = json[document].findIndex(
            (item: Required<Entity>) => item.id === id
          );

          const deleted = json[document][indexToDelete];

          if (indexToDelete > -1) {
            json[document] = json[document]
              .slice(0, indexToDelete)
              .concat(
                json[document].slice(indexToDelete + 1, json[document].lenght)
              );
          } else {
            rej('Invalid id');
          }

          lib.writeFile(path, JSON.stringify(json, null, 2), writeErr => {
            if (writeErr) {
              rej(writeErr);
            }
            res(deleted);
          });
        });
      }),
  });
}
