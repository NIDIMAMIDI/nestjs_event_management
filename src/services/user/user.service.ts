import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { User, UserDocument } from '../../models/user/user.model';
import { MaximumLimitReached } from '../../exception/attendees/attendees.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async userExists(email: string) {
    const existingUser = await this.userModel.findOne({ email });
    return existingUser;
  }

  async userCreate(
    email: string,
    password: string,
    username: string,
    role: string,
  ) {
    const user = await this.userModel.create({
      username,
      password,
      email,
      role: role,
    });
    return user;
  }

  async userTokenUpdate(id: Types.ObjectId, token: string) {
    const updateUser = await this.userModel.findByIdAndUpdate(id, { token });
    return updateUser;
  }

  async userById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async removeToken(id: Types.ObjectId): Promise<void> {
    // Update the user's token field to null
    await this.userModel.findByIdAndUpdate(id, { token: null }, { new: true });
  }

  async checkAttendeesAndCapacity(attendees: Types.ObjectId[]=[], capacity:number) {
    let validAttendees:Types.ObjectId[] = [];
    let adjustedCapacity = capacity;
 
  
    if (attendees && attendees.length > 0) {
     
      
      // Find valid attendees from the User model
      const validAttendeesList = await this.userModel.find({ _id: { $in: attendees } });
      
      validAttendees = validAttendeesList.map((user) => user._id);
      
  
      // Check if the number of valid attendees exceeds the event capacity
      if (validAttendees.length > capacity) {
        throw new MaximumLimitReached( `Number of valid attendees (${validAttendees.length}) exceeds the event capacity (${capacity})`)
      }
  
      // Adjust the capacity by subtracting the number of valid attendees
      adjustedCapacity = capacity - validAttendees.length;
    }
    
    return { validAttendees, adjustedCapacity };
  };
  
}
