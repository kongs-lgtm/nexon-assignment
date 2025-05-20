export interface IAuthorizedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}
