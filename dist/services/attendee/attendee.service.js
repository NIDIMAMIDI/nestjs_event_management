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
exports.AttendeeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const attendee_model_1 = require("../../models/attendee/attendee.model");
const mongoose_2 = require("mongoose");
let AttendeeService = class AttendeeService {
    constructor(attendeeModel, connection) {
        this.attendeeModel = attendeeModel;
        this.connection = connection;
    }
    async insertAttendees(validAttendees, id) {
        if (validAttendees.length > 0) {
            await this.attendeeModel.insertMany(validAttendees.map((attendeeId) => ({
                event_id: id,
                user_id: attendeeId,
            })));
        }
    }
    async attendeeList(id) {
        const attendeesList = await this.attendeeModel
            .find({ event_id: id })
            .populate('user_id', 'username');
        return attendeesList;
    }
    // Delete event and its attendees
    async deleteAttendees(eventId) {
        // await this.eventModel.findByIdAndDelete(eventId).exec();
        await this.attendeeModel.deleteMany({ event_id: eventId }).exec();
    }
    async findAttendee(eventId, userId) {
        return this.attendeeModel
            .findOne({ event_id: eventId, user_id: userId })
            .exec();
    }
    async createAttendee(eventId, userId) {
        const attendee = new this.attendeeModel({
            event_id: eventId,
            user_id: userId,
        });
        return attendee.save();
    }
    async deleteAttendee(userId, eventId) {
        // Delete the attendee entry to cancel registration
        await this.attendeeModel.findOneAndDelete({
            user_id: userId,
            event_id: eventId,
        });
    }
};
exports.AttendeeService = AttendeeService;
exports.AttendeeService = AttendeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendee_model_1.Attendee.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection])
], AttendeeService);
//# sourceMappingURL=attendee.service.js.map