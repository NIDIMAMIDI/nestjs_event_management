import { UserService } from '../user/user.service';
import { SignUpDto } from '../../dto/user/signup/signup.user.dto';
export declare class AuthService {
    private userService;
    constructor(userService: UserService);
    userRegistration(data: SignUpDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models/user/user.model").User> & import("../../models/user/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, import("../../models/user/user.model").User> & import("../../models/user/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
