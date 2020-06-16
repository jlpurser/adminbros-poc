import parser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { env } from './config';
import { users } from './routes/users';

const app = express();

// ----------------------- Middleware -------------------------

/** Configure dynamic origins */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (origin && env.clients().indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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

// ----------------------- Open Port -----------------------------
app.listen(env.port(), () => {
  if (env.nodeEnv() !== 'production') {
    console.log(`Running on port ${env.port()}`);
  }
});
