import { AuthService } from '../../services/auth/auth.service';
import { SignUpDto } from '../../dto/user/signup/signup.user.dto';
import { JwtServices } from '../../services/jwt/jwt.service';
import { UserService } from '../../services/user/user.service';
import { Response } from 'express';
import { SignInDto } from '../../dto/user/signin/signin.user.dto';
import { AuthenticatedRequest } from '../../interface/user/user.interface';
export declare class AuthController {
    private authService;
    private jwtService;
    private userService;
    constructor(authService: AuthService, jwtService: JwtServices, userService: UserService);
    userSign(data: SignUpDto, response: Response): Promise<void>;
    signIn(data: SignInDto, response: Response): Promise<void>;
    logout(request: AuthenticatedRequest, response: Response): Promise<Response<any, Record<string, any>>>;
}
