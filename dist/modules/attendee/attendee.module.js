"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendeeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const attendee_model_1 = require("../../models/attendee/attendee.model");
const attendee_controller_1 = require("../../controllers/attendee/attendee.controller");
const attendee_service_1 = require("../../services/attendee/attendee.service");
const user_module_1 = require("../user/user.module");
const event_module_1 = require("../event/event.module");
const jwt_module_1 = require("../jwt/jwt.module");
const config_1 = require("@nestjs/config");
let AttendeeModule = class AttendeeModule {
};
exports.AttendeeModule = AttendeeModule;
exports.AttendeeModule = AttendeeModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: attendee_model_1.Attendee.name, schema: attendee_model_1.AttendeeSchema }]),
            user_module_1.UserModule, (0, common_1.forwardRef)(() => event_module_1.EventModule), jwt_module_1.JwtModules, config_1.ConfigModule],
        controllers: [attendee_controller_1.AttendeeController],
        providers: [attendee_service_1.AttendeeService],
        exports: [attendee_service_1.AttendeeService]
    })
], AttendeeModule);
//# sourceMappingURL=attendee.module.js.map