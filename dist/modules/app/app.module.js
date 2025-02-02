"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const jwt_module_1 = require("../jwt/jwt.module");
const event_module_1 = require("../event/event.module");
const attendee_module_1 = require("../attendee/attendee.module");
const mail_module_1 = require("../mail/mail.module");
// import { GlobalJwtModuleModule } from '../global-jwt-module/global-jwt-module.module';
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            attendee_module_1.AttendeeModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            mail_module_1.MailModule,
            event_module_1.EventModule,
            jwt_module_1.JwtModules,
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true, // Makes the ConfigModule global, so you don't need to import it in other modules.
                expandVariables: true, // Allows environment variable expansion.
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map