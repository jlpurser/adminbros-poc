import AdminBro, { AdminBroOptions } from 'admin-bro';
import { Request, Response } from 'express';
import { User } from '../models/model.user';
// using require because it is not typed :(
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

export const adminOptions: AdminBroOptions = {
  resources: [
    {
      resource: User,
      options: {
        actions: {
          new: { isVisible: true },
          edit: { isVisible: false },
          delete: { isVisible: false },
          bulkDelete: { isVisible: false },
          approve: {
            actionType: 'record',
            component: false,
            handler: (req: Request, res: Response) =>
              // console.log('params', req.params);
              // console.log('context', context);
              User.updateOne(
                { _id: req.params.recordId },
                { isPerformer: true }
              )
                .then(data => res.json(data))
                .catch(error => console.log(error)),
          },
          deny: {
            actionType: 'record',
            component: false,
            handler: (req: Request, res: Response) =>
              User.updateOne(
                { _id: req.params.recordId },
                {
                  isPerformer: false,
                }
              )
                .then(data => res.json(data))
                .catch(() => console.log('error')),
          },
        },
      },
    },
  ],
};
