import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { Request } from 'express';
import { UserService } from '../../services/user/user.service';
import { UserInterface } from '../../interface/user/user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService, // Inject the UsersService
    private configService: ConfigService, // Inject the ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    try {
      // Get the secret from the config service
      const secret = this.configService.get<string>('JWT_SECRET_KEY');

      // Verify the token and extract the payload
      const payload = await this.jwtService.verifyAsync(token, {
        secret, // Use the secret from the environment variable
      });

      // Fetch the user from the database using the payload ID
      const user: UserInterface | null = await this.usersService.userById(
        payload.id,
      );
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Assign the full user data to request['user']
      request['user'] = user;
    } catch (error) {
      console.error('Error in AuthGuard:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
