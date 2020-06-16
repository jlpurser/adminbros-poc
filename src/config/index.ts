// --------------- Env variables ------------------

/** Add env variable aliases here with type */
// eslint-disable-next-line max-classes-per-file
type Config = {
  /** Port to listen for http requests */
  port(): number | never;
  /** Environment i.e. development, testing, production */
  nodeEnv(): string | never;
  /** List of clients allowed to access the server app */
  clients(): string[] | never;
};

/** Add env variables here */
export const env: Readonly<Config> = {
  port() {
    if (isNaN(Number(process.env.PORT))) {
      throw new Error('Missing process.env.PORT');
    }
    return Number(process.env.PORT);
  },
  nodeEnv() {
    if (process.env.NODE_ENV !== undefined) {
      return process.env.NODE_ENV;
    }
    throw new Error('Missing process.env.NODE_ENV');
  },
  clients() {
    // This will throw if undefined in .env
    return JSON.parse(process.env.CLIENTS || 'undefined');
  },
};
