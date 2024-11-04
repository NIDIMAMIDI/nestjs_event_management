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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const alreadyUserExists_exception_1 = require("../../exception/alreadyUserExists/alreadyUserExists.exception");
const passwordHashing_helpers_1 = require("../../helpers/passwordHashing/passwordHashing.helpers");
let AuthService = class AuthService {
    constructor(userService) {
        this.userService = userService;
    }
    async userRegistration(data) {
        const { username, email, password, role } = data;
        const loweredEmail = email.toLowerCase();
        // Check if the user already exists
        const existingUser = await this.userService.userExists(loweredEmail);
        if (existingUser) {
            throw new alreadyUserExists_exception_1.AlreadyUserExistsException(`User with ${loweredEmail} email already exists`);
        }
        // Hash the password with bcrypt (use 12 salt rounds)
        const hashedPassword = await (0, passwordHashing_helpers_1.hashPassword)(password, 12);
        const user = await this.userService.userCreate(loweredEmail, // Pass the email
        hashedPassword, // Pass the password
        username, // Pass the username
        role || 'user');
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map