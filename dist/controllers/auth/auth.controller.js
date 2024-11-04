"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passwordMismatch_exception_1 = require("../../exception/passwordMismatch/passwordMismatch.exception");
const auth_service_1 = require("../../services/auth/auth.service");
const signup_user_dto_1 = require("../../dto/user/signup/signup.user.dto");
const jwt_service_1 = require("../../services/jwt/jwt.service");
const user_service_1 = require("../../services/user/user.service");
const exclude_properties_helpers_1 = require("../../helpers/exclude-properties/exclude-properties.helpers");
const signin_user_dto_1 = require("../../dto/user/signin/signin.user.dto");
const passwordHashing_helpers_1 = require("../../helpers/passwordHashing/passwordHashing.helpers");
const auth_guard_1 = require("../../guards/auth/auth.guard");
let AuthController = class AuthController {
    constructor(authService, jwtService, userService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    //    Registration
    async userSign(data, response) {
        // Check if the passwords match
        if (data.password !== data.confirmPassword) {
            throw new passwordMismatch_exception_1.PasswordMismatchException(); // Throw a custom exception if passwords do not match
        }
        // Register the user
        const user = await this.authService.userRegistration(data);
        // Create a JWT token and get cookie options
        const { token, cookieOptions } = await this.jwtService.createJwtToken(user);
        // Update the user's token in the database
        await this.userService.userTokenUpdate(user._id, token);
        // Fetch the updated user details
        const UserDetails = await this.userService.userById(user._id);
        // Destructure necessary fields from updated user details
        const userDetails = new exclude_properties_helpers_1.UserEntity({
            username: UserDetails?.username,
            email: UserDetails?.email,
            _id: UserDetails?._id.toString(),
            role: UserDetails?.role,
            token: UserDetails?.token,
        });
        // Set the JWT token in a cookie
        response.cookie('jwt', token, cookieOptions);
        // Return success response
        response.status(201).json({
            message: `${userDetails.username} registration is successful`,
            userDetails,
        });
    }
    //      Login
    async signIn(data, response) {
        const { email, password } = data;
        // converting email to a lowerCase
        const loweredEmail = email.toLowerCase();
        // check if user email exists in database
        const existingUser = await this.userService.userExists(loweredEmail);
        if (!existingUser) {
            throw new common_1.NotFoundException(`User with ${loweredEmail} email doesn't exist`);
        }
        // check if password is correct or not
        const isPAsswordCorrect = await (0, passwordHashing_helpers_1.passwordChecking)(password, existingUser.password);
        // if provided password does not match stored password it will throw the error response
        if (!isPAsswordCorrect) {
            throw new common_1.UnauthorizedException('Incorrect password');
        }
        // Create a JWT token and get cookie options
        const { token, cookieOptions } = await this.jwtService.createJwtToken(existingUser);
        // Update the user's token in the database
        await this.userService.userTokenUpdate(existingUser._id, token);
        // Fetch the updated user details
        const UserDetails = await this.userService.userById(existingUser._id);
        // Destructure necessary fields from updated user details
        const userDetails = new exclude_properties_helpers_1.UserEntity({
            username: UserDetails?.username,
            email: UserDetails?.email,
            _id: UserDetails?._id.toString(),
            role: UserDetails?.role,
            token: UserDetails?.token,
        });
        // Set the JWT token in a cookie
        response.cookie('jwt', token, cookieOptions);
        // Return success response
        response.status(201).json({
            message: `${userDetails.username} registration is successful`,
            userDetails,
        });
    }
    async logout(request, response) {
        const user = request.user;
        // Check if user exists in the request (to ensure a valid token was provided)
        if (!user) {
            throw new common_1.UnauthorizedException('User not found or not logged in');
        }
        // Clear the stored token in the user's record in the database
        await this.userService.removeToken(user._id);
        // Clear the cookie containing the JWT by setting it with a past expiration date
        response.cookie('jwt', '', {
            httpOnly: true,
            secure: true, // Set this to true if your API is served over HTTPS
            expires: new Date(0), // Set the cookie expiration to a past date
        });
        // Respond with a success message
        return response.status(200).json({
            message: 'Logout successful',
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_user_dto_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userSign", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_user_dto_1.SignInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_service_1.JwtServices,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map