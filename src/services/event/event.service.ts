import { Injectable } from '@nestjs/common';
import { Event, EventDocument } from '../../models/event/event.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { UpdateEventDto } from '../../dto/event/update/update.event';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(
    title: string,
    description: string,
    date: Date,
    location: string,
    capacity: number,
    createdBy: Types.ObjectId,
  ) {
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

  async searchEventById(id: Types.ObjectId) {
    const event = this.eventModel.findById(id);
    return event;
  }
  async searchEventByTitleAndCreator(title: string, createdBy: Types.ObjectId) {
    const event = this.eventModel.findOne({ title, createdBy });
    return event;
  }

  async findAllEvents(searchQuery: any, page: number, limit: number) {
    const events = await this.eventModel
      .find(searchQuery)
      .skip((page - 1) * limit) // Skip the documents based on the page number
      .limit(limit) // Limit the number of documents returned
      .exec(); // Execute the query

    return events;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventModel
      .findByIdAndUpdate(id, updateEventDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  // Delete event and its attendees
  async deleteEvent(eventId: Types.ObjectId): Promise<void> {
    await this.eventModel.findByIdAndDelete(eventId).exec();
    // await this.attendeeModel.deleteMany({ event_id: eventId }).exec();
  }

  async updateCapacity(id: Types.ObjectId, newCapacity: number): Promise<void> {
    await this.eventModel
      .findByIdAndUpdate(
        id,
        { capacity: newCapacity },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async cancelRegistrationUpdates(eventId: Types.ObjectId) {
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
}
