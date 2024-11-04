import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Attendee,
  AttendeeDocument,
} from '../../models/attendee/attendee.model';
import { Connection, Model, Types } from 'mongoose';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<AttendeeDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async insertAttendees(validAttendees: Types.ObjectId[], id: Types.ObjectId) {
    if (validAttendees.length > 0) {
      await this.attendeeModel.insertMany(
        validAttendees.map((attendeeId) => ({
          event_id: id,
          user_id: attendeeId,
        })),
      );
    }
  }

  async attendeeList(id: Types.ObjectId) {
    const attendeesList = await this.attendeeModel
      .find({ event_id: id })
      .populate('user_id', 'username');
    return attendeesList;
  }

  // Delete event and its attendees
  async deleteAttendees(eventId: Types.ObjectId): Promise<void> {
    // await this.eventModel.findByIdAndDelete(eventId).exec();
    await this.attendeeModel.deleteMany({ event_id: eventId }).exec();
  }

  async findAttendee(
    eventId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Attendee | null> {
    return this.attendeeModel
      .findOne({ event_id: eventId, user_id: userId })
      .exec();
  }

  async createAttendee(
    eventId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Attendee> {
    const attendee = new this.attendeeModel({
      event_id: eventId,
      user_id: userId,
    });
    return attendee.save();
  }

  async deleteAttendee(userId: Types.ObjectId, eventId: Types.ObjectId) {
    // Delete the attendee entry to cancel registration
    await this.attendeeModel.findOneAndDelete({
      user_id: userId,
      event_id: eventId,
    });
  }
}
