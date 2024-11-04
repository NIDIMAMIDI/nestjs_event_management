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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const event_model_1 = require("../../models/event/event.model");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let EventService = class EventService {
    constructor(eventModel, connection) {
        this.eventModel = eventModel;
        this.connection = connection;
    }
    async create(title, description, date, location, capacity, createdBy) {
        const eventData = await this.eventModel.create({
            title: title,
            description: description,
            date: date,
            location: location,
            capacity: capacity,
            createdBy,
        });
        return eventData;
    }
    async searchEventById(id) {
        const event = this.eventModel.findById(id);
        return event;
    }
    async searchEventByTitleAndCreator(title, createdBy) {
        const event = this.eventModel.findOne({ title, createdBy });
        return event;
    }
    async findAllEvents(searchQuery, page, limit) {
        const events = await this.eventModel
            .find(searchQuery)
            .skip((page - 1) * limit) // Skip the documents based on the page number
            .limit(limit) // Limit the number of documents returned
            .exec(); // Execute the query
        return events;
    }
    async update(id, updateEventDto) {
        return this.eventModel
            .findByIdAndUpdate(id, updateEventDto, {
            new: true,
            runValidators: true,
        })
            .exec();
    }
    // Delete event and its attendees
    async deleteEvent(eventId) {
        await this.eventModel.findByIdAndDelete(eventId).exec();
        // await this.attendeeModel.deleteMany({ event_id: eventId }).exec();
    }
    async updateCapacity(id, newCapacity) {
        await this.eventModel
            .findByIdAndUpdate(id, { capacity: newCapacity }, { new: true, runValidators: true })
            .exec();
    }
    async cancelRegistrationUpdates(eventId) {
        // Find the event
        const event = await this.eventModel.findById(eventId);
        // Check if the event exists
        if (!event) {
            throw new Error('Event not found'); // You can throw a more specific error if needed
        }
        // Increment the event capacity
        event.capacity += 1;
        await event.save();
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_model_1.Event.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection])
], EventService);
//# sourceMappingURL=event.service.js.map