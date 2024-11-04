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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("../../models/user/user.model");
const attendees_exception_1 = require("../../exception/attendees/attendees.exception");
let UserService = class UserService {
    constructor(userModel, connection) {
        this.userModel = userModel;
        this.connection = connection;
    }
    async userExists(email) {
        const existingUser = await this.userModel.findOne({ email });
        return existingUser;
    }
    async userCreate(email, password, username, role) {
        const user = await this.userModel.create({
            username,
            password,
            email,
            role: role,
        });
        return user;
    }
    async userTokenUpdate(id, token) {
        const updateUser = await this.userModel.findByIdAndUpdate(id, { token });
        return updateUser;
    }
    async userById(id) {
        const user = await this.userModel.findById(id);
        return user;
    }
    async removeToken(id) {
        // Update the user's token field to null
        await this.userModel.findByIdAndUpdate(id, { token: null }, { new: true });
    }
    async checkAttendeesAndCapacity(attendees = [], capacity) {
        let validAttendees = [];
        let adjustedCapacity = capacity;
        if (attendees && attendees.length > 0) {
            // Find valid attendees from the User model
            const validAttendeesList = await this.userModel.find({ _id: { $in: attendees } });
            validAttendees = validAttendeesList.map((user) => user._id);
            // Check if the number of valid attendees exceeds the event capacity
            if (validAttendees.length > capacity) {
                throw new attendees_exception_1.MaximumLimitReached(`Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`);
            }
            // Adjust the capacity by subtracting the number of valid attendees
            adjustedCapacity = capacity - validAttendees.length;
        }
        return { validAttendees, adjustedCapacity };
    }
    ;
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection])
], UserService);
//# sourceMappingURL=user.service.js.map