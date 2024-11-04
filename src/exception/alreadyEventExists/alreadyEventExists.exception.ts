import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyEventExistsException extends HttpException {
  constructor(message?: string) {
    // Use the provided message or fallback to the default message
    super(message || 'Event  Already Exists', HttpStatus.CONFLICT); // Use 409 for conflict
  }
}
