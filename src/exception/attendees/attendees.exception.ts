import { HttpException, HttpStatus } from '@nestjs/common';

export class MaximumLimitReached extends HttpException {
  constructor(message?: string) {
    // Use the provided message or fallback to the default message
    super(message || 'Event does not have enough capacity', HttpStatus.CONFLICT); // Use 409 for conflict
  }
}
