import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordMismatchException extends HttpException {
  constructor() {
    super(
      'Password and Confirm Password must match. Please provide them as same.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
