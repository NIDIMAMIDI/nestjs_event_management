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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../../guards/auth/auth.guard");
const create_event_dto_1 = require("../../dto/event/create/create.event.dto");
const event_service_1 = require("../../services/event/event.service");
const user_service_1 = require("../../services/user/user.service");
const mongoose_1 = require("mongoose");
const alreadyEventExists_exception_1 = require("../../exception/alreadyEventExists/alreadyEventExists.exception");
const attendee_service_1 = require("../../services/attendee/attendee.service");
const searchQuery_helpers_1 = require("../../helpers/searchQuery/searchQuery.helpers");
const update_event_1 = require("../../dto/event/update/update.event");
const mail_service_1 = require("../../services/mail/mail.service");
let EventController = class EventController {
    constructor(eventService, userService, attendeeService, mailService) {
        this.eventService = eventService;
        this.userService = userService;
        this.attendeeService = attendeeService;
        this.mailService = mailService;
    }
    async createEvent(data, request) {
        try {
            // Destructure the request body
            const { title, description, date, location, capacity, attendees } = data;
            const createdBy = request.user?._id; // Fetch the user ID from the request
            // Fetch the user and check if the user exists
            const user = await this.userService.userById(createdBy);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            // Convert the title to lowercase for uniqueness
            const eventTitle = title.toLowerCase();
            // Check if the event already exists with the same title for this user
            const existingEvent = await this.eventService.searchEventByTitleAndCreator(eventTitle, createdBy);
            if (existingEvent) {
                throw new alreadyEventExists_exception_1.AlreadyEventExistsException('User has already created that event.');
            }
            // Convert the date string to a JavaScript Date object
            const eventDate = new Date(date);
            // Validate the attendees and adjust the capacity accordingly
            const { validAttendees, adjustedCapacity } = await this.userService.checkAttendeesAndCapacity(attendees, capacity);
            // Create the event with the validated details
            const newEvent = await this.eventService.create(eventTitle, description || '', eventDate, location, adjustedCapacity, createdBy);
            // Insert valid attendees into the attendee collection
            await this.attendeeService.insertAttendees(validAttendees, newEvent._id);
            // Retrieve the list of attendees for the event
            const attendeesList = await this.attendeeService.attendeeList(newEvent._id);
            // Return the response with event and attendees details
            return {
                status: 'success',
                message: 'Event created successfully',
                event: newEvent,
                attendees: attendeesList.map((att) => att.user_id),
            };
        }
        catch (error) {
            // Handle and log errors appropriately
            if (error instanceof common_1.NotFoundException ||
                error instanceof alreadyEventExists_exception_1.AlreadyEventExistsException) {
                throw error; // Re-throw known exceptions
            }
            else {
                throw new common_1.InternalServerErrorException('An error occurred while creating the event');
            }
        }
    }
    async allEvents(page, limit, title, date, location, capacity) {
        try {
            // Convert page and limit to numbers, using defaults if they are not provided
            const pageNumber = Number(page) || 1; // Convert page to number or default to 1
            const pageLimit = Number(limit) || 10; // Convert limit to number or default to 2
            // Convert capacity to a number if provided
            const capacityNum = capacity ? Number(capacity) : undefined;
            // Build the query object for search
            const searchQuery = await (0, searchQuery_helpers_1.query)(title, date, location, capacityNum);
            // Find the events with pagination and search
            const events = await this.eventService.findAllEvents(searchQuery, pageNumber, pageLimit);
            // Return the response with pagination and events
            return {
                status: 'success',
                page: pageNumber,
                events,
            };
        }
        catch (error) {
            // Log the error if needed (optional)
            console.error('Error fetching events:', error);
            // Throw a standardized HTTP exception with an appropriate message
            throw new common_1.HttpException({
                status: 'failure',
                message: 'An error occurred while fetching events',
                // error: error.message // Include error message for debugging
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEvent(id) {
        try {
            // Find the event by ID
            const event = await this.eventService.searchEventById(id); // Use your service to find the event
            if (!event) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'Event not found with the provided ID.',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            // Retrieve the list of attendees for the event
            const attendeesList = await this.attendeeService.attendeeList(event._id);
            // If attendeesList is empty or not found
            return {
                status: 'success',
                message: 'Event details retrieved successfully.',
                event,
                attendees: attendeesList.map((att) => att.user_id) || [], // Return the user IDs of the attendees
            };
        }
        catch (err) {
            // Log the error if needed
            console.error('Error retrieving event:', err);
            throw new common_1.HttpException({
                status: 'failure',
                message: 'An error occurred while retrieving the event details.',
                //   error: err.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEvent(id, updateEventDto, request) {
        try {
            const event = await this.eventService.searchEventById(id);
            // Check if the event exists
            if (!event) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'Event not found with the provided ID.',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const userId = request.user?._id;
            // Ensure the event creator is the one making the update
            if (event.createdBy.toString() !== userId.toString()) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'You are not authorized to perform this action.',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            // Update the event
            const updatedEvent = await this.eventService.update(id.toString(), updateEventDto);
            return {
                status: 'success',
                message: 'Event updated successfully.',
                event: updatedEvent,
            };
        }
        catch (err) {
            let errorMessage = 'An error occurred while updating the event.';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            throw new common_1.HttpException({
                status: 'failure',
                message: errorMessage,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteEvent(id, req) {
        try {
            const event = await this.eventService.searchEventById(id);
            // Check if the event exists
            if (!event) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'Event not found with the provided ID.',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            const userId = req['user']._id.toString(); // Assuming `req['user']` has user object from AuthGuard
            // Ensure the event creator is the one deleting the event
            if (event.createdBy.toString() !== userId) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'You are not authorized to perform this action.',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            // Delete the event and its associated attendees
            await this.eventService.deleteEvent(event._id);
            await this.attendeeService.deleteAttendees(event._id);
            return {
                status: 'success',
                message: 'Event and its attendees have been deleted successfully.',
            };
        }
        catch (err) {
            throw new common_1.HttpException({
                status: 'failure',
                message: 'An error occurred while deleting the event.',
                error: err instanceof Error ? err.message : 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async registerForEvent(id, req) {
        try {
            const userId = req['user']._id;
            // Check if the event exists
            const event = await this.eventService.searchEventById(id);
            if (!event) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'Event not found with the provided ID.',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            // Check if the event is already full
            if (event.capacity <= 0) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'The event has reached its maximum capacity.',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            // Check if the user is already registered for the event
            const existingAttendee = await this.attendeeService.findAttendee(event._id, userId);
            if (existingAttendee) {
                throw new common_1.HttpException({
                    status: 'failure',
                    message: 'You are already registered for this event.',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            // Register the user as an attendee
            const attendee = await this.attendeeService.createAttendee(event._id, userId);
            // Decrease the event capacity by 1
            event.capacity -= 1;
            await this.eventService.updateCapacity(event._id, event.capacity);
            // Send the registration confirmation email
            await this.mailService.sendEventRegistrationMail(userId, event.title);
            return {
                status: 'success',
                message: 'You have successfully registered for the event.',
                attendee,
            };
        }
        catch (err) {
            throw new common_1.HttpException({
                status: 'failure',
                message: 'An error occurred during registration.',
                error: err instanceof Error ? err.message : 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async cancelEventRegister(id, req) {
        const userId = req.user?._id;
        try {
            // Use the event service to check if the event exists
            const event = await this.eventService.searchEventById(id);
            if (!event) {
                return {
                    status: 'failure',
                    message: 'Event not found with the provided ID.',
                };
            }
            // Check if the user is registered for the event
            const attendee = await this.attendeeService.findAttendee(event._id, userId);
            if (!attendee) {
                return {
                    status: 'failure',
                    message: 'You are not registered for this event.',
                };
            }
            // Cancel the registration
            await this.attendeeService.deleteAttendee(userId, event._id);
            await this.eventService.cancelRegistrationUpdates(event._id);
            // Send the cancellation email to the user
            await this.mailService.sendEventCancelRegistrationMail(userId, event.title);
            return {
                status: 'success',
                message: 'You have successfully canceled your registration for the event.',
            };
        }
        catch (err) {
            throw new common_1.HttpException({
                status: 'failure',
                message: 'An error occurred during registration.',
                error: err instanceof Error ? err.message : 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('title')),
    __param(3, (0, common_1.Query)('date')),
    __param(4, (0, common_1.Query)('location')),
    __param(5, (0, common_1.Query)('capacity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "allEvents", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "getEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, update_event_1.UpdateEventDto, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, Request]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(':id/register'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, Request]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "registerForEvent", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard) // Protect this route with the AuthGuard
    ,
    (0, common_1.Delete)(':id/cancel-registration') // Define the route for canceling registration
    ,
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "cancelEventRegister", null);
exports.EventController = EventController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [event_service_1.EventService,
        user_service_1.UserService,
        attendee_service_1.AttendeeService,
        mail_service_1.EventMailService])
], EventController);
//# sourceMappingURL=event.controller.js.map