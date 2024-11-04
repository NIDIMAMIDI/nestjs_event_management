import { UserInterface } from '../../interface/user/user.interface';
import { JwtService } from '@nestjs/jwt';
export declare class JwtServices {
    private jwtService;
    constructor(jwtService: JwtService);
    createJwtToken(user: UserInterface): Promise<{
        token: string;
        cookieOptions: {
            httpOnly: boolean;
            secure: boolean;
            sameSite: "strict";
            maxAge: number;
        };
    }>;
}
