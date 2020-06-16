export type Entity = {
  id: string;
};

export type User = Entity & {
  firstName: string;
  lastName: string;
  email: string;
};

export type APIResponse<D> =
  | {
      success: true;
      data: D;
    }
  | {
      success: false;
      error: any;
    };
