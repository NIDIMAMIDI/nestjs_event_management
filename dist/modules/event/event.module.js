"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const event_controller_1 = require("../../controllers/event/event.controller");
const event_service_1 = require("../../services/event/event.service");
const jwt_module_1 = require("../jwt/jwt.module");
const config_1 = require("@nestjs/config");
const user_module_1 = require("../user/user.module");
const mongoose_1 = require("@nestjs/mongoose");
const event_model_1 = require("../../models/event/event.model");
const attendee_module_1 = require("../attendee/attendee.module");
const mail_module_1 = require("../mail/mail.module");
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: event_model_1.Event.name, schema: event_model_1.EventSchema }]),
            jwt_module_1.JwtModules,
            config_1.ConfigModule,
            user_module_1.UserModule,
            mail_module_1.MailModule,
            (0, common_1.forwardRef)(() => attendee_module_1.AttendeeModule),
        ], // Use forwardRef here],
        controllers: [event_controller_1.EventController],
        providers: [event_service_1.EventService],
    })
], EventModule);
//# sourceMappingURL=event.module.js.map