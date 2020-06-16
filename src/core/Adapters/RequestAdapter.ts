import { Request, Response } from 'express';
import { APIResponse } from '../Entities';

/**
 * Transforms an HTTP request as Express expects it to arguments
 * for our controller methods
 * @param controller A function from a Controller object
 * @returns A function that fits the shape of an Express callback
 */
export function expressAdapter(
  controller: (a?: any, b?: any) => Promise<APIResponse<any>>
): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    switch (req.method) {
      case 'POST':
        controller(req.body).then(data => {
          res.status(data.success ? 201 : 500).json(data);
        });
        break;
      case 'GET':
        if (req.params.id) {
          controller(req.params.id).then(data => {
            res.status(data.success ? 200 : 500).json(data);
          });
        } else if (
          req.query.take !== undefined &&
          req.query.offset === undefined
        ) {
          controller(Number(req.query.take)).then(data => {
            res.status(data.success ? 200 : 500).json(data);
          });
        } else if (
          req.query.take !== undefined &&
          req.query.offset !== undefined
        ) {
          console.log(req.query);
          controller(Number(req.query.take), Number(req.query.offset)).then(
            data => {
              res.status(data.success ? 200 : 500).json(data);
            }
          );
        } else {
          controller().then(data => {
            res.status(data.success ? 200 : 500).json(data);
          });
        }
        break;
      case 'PUT':
        controller(req.body).then(data => {
          res.status(data.success ? 201 : 500).json(data);
        });
        break;
      case 'DELETE':
        controller(req.params.id).then(data => {
          res.status(data.success ? 201 : 500).json(data);
        });
        break;
      default:
        res.status(400).json({ error: 'Invalid request' });
    }
  };
}
