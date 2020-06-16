import AdminBro from 'admin-bro';
import parser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { adminOptions } from './admin/options';
import { env } from './config';
import { User } from './models/model.user';
import { buildAdminRouter } from './routes/admin';
import { users } from './routes/users';

const app = express();

// ----------------------- Middleware -------------------------
const admin = new AdminBro(adminOptions);

app.use(admin.options.rootPath, buildAdminRouter(admin));

/** Configure dynamic origins */
const corsOptions: cors.CorsOptions = {
  origin: (origin, next) => {
    if (origin && env.clients().indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error('Not allowed by CORS'));
    }
  },
};

/** Allow requests from client app */
app.use(cors(env.nodeEnv() === 'production' ? corsOptions : undefined));

/** Handles request body with `application/json` header */
app.use(parser.json());

/** Catch malformed req bodies */
app.use((error: any, _req: Request, res: Response, next: () => void) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'Error in request body.' });
  } else {
    next();
  }
});

// ----------------------- Routes -----------------------------
/** test route TODO: delete */
app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.use('/api/v1/users', users);

app.get('/users', (req: Request, res: Response) => {
  User.find({}).then(data => {
    res.json(data);
  });
});

// ----------------------- Start up ---------------------------
export const startUp = async () => {
  // Connect to mongodb
  await mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  // Listen on port
  app.listen(env.port(), () => {
    if (env.nodeEnv() !== 'production') {
      console.log(`Running on port ${env.port()}`);
    }
  });
};
