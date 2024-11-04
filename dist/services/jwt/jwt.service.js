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
exports.JwtServices = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let JwtServices = class JwtServices {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async createJwtToken(user) {
        const payload = { id: user._id, email: user.email };
        const token = await this.jwtService.signAsync(payload);
        const cookieOptions = {
            httpOnly: true, // Prevents client-side scripts from accessing the token
            secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent only over HTTPS in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
        };
        return { token, cookieOptions };
    }
};
exports.JwtServices = JwtServices;
exports.JwtServices = JwtServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtServices);
//# sourceMappingURL=jwt.service.js.map