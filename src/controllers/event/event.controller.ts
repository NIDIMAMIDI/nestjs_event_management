import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { CreateEventDto } from '../../dto/event/create/create.event.dto';
import { EventService } from '../../services/event/event.service';
import { AuthenticatedRequest } from '../../interface/user/user.interface';
import { UserService } from '../../services/user/user.service';
import { Types } from 'mongoose';

import { AlreadyEventExistsException } from '../../exception/alreadyEventExists/alreadyEventExists.exception';
import { AttendeeService } from '../../services/attendee/attendee.service';
import { query } from '../../helpers/searchQuery/searchQuery.helpers';
import { UpdateEventDto } from '../../dto/event/update/update.event';
import { EventMailService } from '../../services/mail/mail.service';

@Controller('events')
export class EventController {
  constructor(
    private eventService: EventService,
    private userService: UserService,
    private attendeeService: AttendeeService,
    private mailService: EventMailService,
  ) {}
  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(201)
  async createEvent(
    @Body() data: CreateEventDto,
    @Req() request: AuthenticatedRequest,
  ) {
    try {
      // Destructure the request body
      const { title, description, date, location, capacity, attendees } = data;
      const createdBy = request.user?._id as Types.ObjectId; // Fetch the user ID from the request

      // Fetch the user and check if the user exists
      const user = await this.userService.userById(createdBy);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Convert the title to lowercase for uniqueness
      const eventTitle = title.toLowerCase();

      // Check if the event already exists with the same title for this user
      const existingEvent =
        await this.eventService.searchEventByTitleAndCreator(
          eventTitle,
          createdBy,
        );
      if (existingEvent) {
        throw new AlreadyEventExistsException(
          'User has already created that event.',
        );
      }

      // Convert the date string to a JavaScript Date object
      const eventDate = new Date(date);

      // Validate the attendees and adjust the capacity accordingly
      const { validAttendees, adjustedCapacity } =
        await this.userService.checkAttendeesAndCapacity(attendees!, capacity);

      // Create the event with the validated details
      const newEvent = await this.eventService.create(
        eventTitle,
        description || '',
        eventDate,
        location,
        adjustedCapacity,
        createdBy,
      );

      // Insert valid attendees into the attendee collection
      await this.attendeeService.insertAttendees(validAttendees, newEvent._id);

      // Retrieve the list of attendees for the event
      const attendeesList = await this.attendeeService.attendeeList(
        newEvent._id,
      );

      // Return the response with event and attendees details
      return {
        status: 'success',
        message: 'Event created successfully',
        event: newEvent,
        attendees: attendeesList.map((att) => att.user_id),
      };
    } catch (error) {
      // Handle and log errors appropriately
      if (
        error instanceof NotFoundException ||
        error instanceof AlreadyEventExistsException
      ) {
        throw error; // Re-throw known exceptions
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the event',
        );
      }
    }
  }

  @Get('all')
  async allEvents(
    @Query('page') page?: number, // Default value of 1; keep as string to avoid parsing issues
    @Query('limit') limit?: number, // Default value of 2; keep as string to avoid parsing issues
    @Query('title') title?: string, // Optional title search parameter
    @Query('date') date?: string, // Optional date search parameter
    @Query('location') location?: string, // Optional location search parameter
    @Query('capacity') capacity?: number, // Optional capacity parameter, ensure it's an integer if provided
  ) {
    try {
      // Convert page and limit to numbers, using defaults if they are not provided
      const pageNumber = Number(page) || 1; // Convert page to number or default to 1
      const pageLimit = Number(limit) || 10; // Convert limit to number or default to 2

      // Convert capacity to a number if provided
      const capacityNum = capacity ? Number(capacity) : undefined;

      // Build the query object for search
      const searchQuery = await query(title, date, location, capacityNum);

      // Find the events with pagination and search
      const events = await this.eventService.findAllEvents(
        searchQuery,
        pageNumber,
        pageLimit,
      );

      // Return the response with pagination and events
      return {
        status: 'success',
        page: pageNumber,
        events,
      };
    } catch (error) {
      // Log the error if needed (optional)
      console.error('Error fetching events:', error);

      // Throw a standardized HTTP exception with an appropriate message
      throw new HttpException(
        {
          status: 'failure',
          message: 'An error occurred while fetching events',
          // error: error.message // Include error message for debugging
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getEvent(@Param('id') id: Types.ObjectId) {
    try {
      // Find the event by ID
      const event = await this.eventService.searchEventById(id); // Use your service to find the event
      if (!event) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'Event not found with the provided ID.',
          },
          HttpStatus.NOT_FOUND,
        );
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
    } catch (err) {
      // Log the error if needed
      console.error('Error retrieving event:', err);

      throw new HttpException(
        {
          status: 'failure',
          message: 'An error occurred while retrieving the event details.',
          //   error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateEvent(
    @Param('id') id: Types.ObjectId,
    @Body() updateEventDto: UpdateEventDto, // Use a DTO for validation
    @Req() request: AuthenticatedRequest, // Adjust based on your Auth structure
  ) {
    try {
      const event = await this.eventService.searchEventById(id);

      // Check if the event exists
      if (!event) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'Event not found with the provided ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const userId = request.user?._id as Types.ObjectId;

      // Ensure the event creator is the one making the update
      if (event.createdBy.toString() !== userId.toString()) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'You are not authorized to perform this action.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // Update the event
      const updatedEvent = await this.eventService.update(
        id.toString(),
        updateEventDto,
      );

      return {
        status: 'success',
        message: 'Event updated successfully.',
        event: updatedEvent,
      };
    } catch (err) {
      let errorMessage = 'An error occurred while updating the event.';

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      throw new HttpException(
        {
          status: 'failure',
          message: errorMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') id: Types.ObjectId, @Req() req: Request) {
    try {
      const event = await this.eventService.searchEventById(id);

      // Check if the event exists
      if (!event) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'Event not found with the provided ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const userId = req['user']._id.toString(); // Assuming `req['user']` has user object from AuthGuard

      // Ensure the event creator is the one deleting the event
      if (event.createdBy.toString() !== userId) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'You are not authorized to perform this action.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // Delete the event and its associated attendees
      await this.eventService.deleteEvent(event._id);
      await this.attendeeService.deleteAttendees(event._id);

      return {
        status: 'success',
        message: 'Event and its attendees have been deleted successfully.',
      };
    } catch (err) {
      throw new HttpException(
        {
          status: 'failure',
          message: 'An error occurred while deleting the event.',
          error: err instanceof Error ? err.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post(':id/register')
  async registerForEvent(@Param('id') id: Types.ObjectId, @Req() req: Request) {
    try {
      const userId = req['user']._id;

      // Check if the event exists
      const event = await this.eventService.searchEventById(id);
      if (!event) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'Event not found with the provided ID.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Check if the event is already full
      if (event.capacity <= 0) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'The event has reached its maximum capacity.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the user is already registered for the event
      const existingAttendee = await this.attendeeService.findAttendee(
        event._id,
        userId,
      );
      if (existingAttendee) {
        throw new HttpException(
          {
            status: 'failure',
            message: 'You are already registered for this event.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Register the user as an attendee
      const attendee = await this.attendeeService.createAttendee(
        event._id,
        userId,
      );

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
    } catch (err) {
      throw new HttpException(
        {
          status: 'failure',
          message: 'An error occurred during registration.',
          error: err instanceof Error ? err.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard) // Protect this route with the AuthGuard
  @Delete(':id/cancel-registration') // Define the route for canceling registration
  async cancelEventRegister(
    @Param('id') id: Types.ObjectId,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?._id as Types.ObjectId;

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
      const attendee = await this.attendeeService.findAttendee(
        event._id,
        userId,
      );
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
      await this.mailService.sendEventCancelRegistrationMail(
        userId,
        event.title,
      );

      return {
        status: 'success',
        message:
          'You have successfully canceled your registration for the event.',
      };
    } catch (err) {
      throw new HttpException(
        {
          status: 'failure',
          message: 'An error occurred during registration.',
          error: err instanceof Error ? err.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
