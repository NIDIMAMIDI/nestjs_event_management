import { Types } from 'mongoose';

export interface UserInterface {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role?: string;
  token?: string;
  __v?: number;
}

// Define a custom request interface
export interface AuthenticatedRequest extends Request {
  user?: UserInterface; // Adjust the type according to your User interface
}
