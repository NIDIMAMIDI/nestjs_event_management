import { Exclude } from 'class-transformer';

export class UserEntity {
  _id!: string;

  email!: string;

  username!: string;

  @Exclude() // Ensure this is only on sensitive properties
  password!: string;

  role!: string;

  token!: string;

  @Exclude()
  __v?: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
