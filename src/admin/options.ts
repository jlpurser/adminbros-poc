import AdminBro, { AdminBroOptions } from 'admin-bro';
import { User } from '../models/model.user';
// using require because it is not typed :(
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

export const adminOptions: AdminBroOptions = {
  resources: [User],
};
