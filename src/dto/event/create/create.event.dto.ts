import { IsString, IsOptional, IsDateString, IsNumber, IsArray, ArrayNotEmpty, IsMongoId, IsNotEmpty } from 'class-validator';
import { IsFutureDate } from '../../../decorators/custom-date/custom-date.decorator';
import { Types } from 'mongoose';


export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @IsFutureDate({ message: 'Date must be in the future and a valid ISO date (YYYY-MM-DDTHH:MM:SSZ).' }) // Custom validation
  date!: string; // Now using string to capture the date in the future

  @IsString()
  location!: string;

  @IsNumber()
  capacity!: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty() // Ensures the array is not empty if provided
  @IsMongoId({ each: true }) // Validates that each item in the array is a valid MongoDB ObjectId
  attendees?: Types.ObjectId[]; // Attendees as an array of user IDs
}
