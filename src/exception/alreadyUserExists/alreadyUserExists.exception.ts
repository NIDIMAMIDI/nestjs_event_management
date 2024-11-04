import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyUserExistsException extends HttpException {
  constructor(message?: string) {
    // Use the provided message or fallback to the default message
    super(message || 'User Already Exists', HttpStatus.CONFLICT); // Use 409 for conflict
  }
}
