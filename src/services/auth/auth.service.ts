import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignUpDto } from '../../dto/user/signup/signup.user.dto';
import { AlreadyUserExistsException } from '../../exception/alreadyUserExists/alreadyUserExists.exception';
import { hashPassword } from '../../helpers/passwordHashing/passwordHashing.helpers';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async userRegistration(data: SignUpDto) {
    const { username, email, password, role } = data;

    const loweredEmail = email.toLowerCase();

    // Check if the user already exists
    const existingUser = await this.userService.userExists(loweredEmail);
    if (existingUser) {
      throw new AlreadyUserExistsException(
        `User with ${loweredEmail} email already exists`,
      );
    }

    // Hash the password with bcrypt (use 12 salt rounds)
    const hashedPassword = await hashPassword(password, 12);

    const user = await this.userService.userCreate(
      loweredEmail, // Pass the email
      hashedPassword, // Pass the password
      username, // Pass the username
      role || 'user', // Pass the role or default to 'user'
    );

    return user;
  }
}
