import fs from 'fs';
import path from 'path';
import { makeFsAdapter } from '../core/Adapters/FsAdapter';

export const usersModelFS = makeFsAdapter(
  fs,
  path.resolve(__dirname, '../db/db.txt')
);
