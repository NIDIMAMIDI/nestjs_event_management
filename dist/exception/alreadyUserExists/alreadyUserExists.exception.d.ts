import { HttpException } from '@nestjs/common';
export declare class AlreadyUserExistsException extends HttpException {
    constructor(message?: string);
}
