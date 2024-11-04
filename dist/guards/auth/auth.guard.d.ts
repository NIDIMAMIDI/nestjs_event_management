import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../services/user/user.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private usersService;
    private configService;
    constructor(jwtService: JwtService, usersService: UserService, // Inject the UsersService
    configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
