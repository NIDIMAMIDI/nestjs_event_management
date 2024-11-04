import { Injectable } from '@nestjs/common';
import { UserInterface } from '../../interface/user/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServices {
  constructor(private jwtService: JwtService) {}

  async createJwtToken(user: UserInterface) {
    const payload = { id: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    const cookieOptions = {
      httpOnly: true, // Prevents client-side scripts from accessing the token
      secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent only over HTTPS in production
      sameSite: 'strict' as const, // Helps prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    };

    return { token, cookieOptions };
  }
}
